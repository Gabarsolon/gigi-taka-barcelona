#!/usr/bin/env python3
"""
Gigi-Taka-Barcelona - Football Data Harvester
Consumes data from Transfermarkt API (felipeall/transfermarkt-api) or direct endpoints
to enrich the client-side players.json database for Gigi-Taka-Barcelona.

Usage:
  python scripts/harvest_tm.py --help
  python scripts/harvest_tm.py --search "Stanciu"
  python scripts/harvest_tm.py --club 301 # FCSB club ID on Transfermarkt
  python scripts/harvest_tm.py --verify-data
"""

import sys
import json
import argparse
import unicodedata
from pathlib import Path
from typing import Dict, List, Any

try:
    import httpx
except ImportError:
    import requests as httpx  # fallback

DATA_FILE = Path(__file__).resolve().parent.parent / "src" / "data" / "players.json"
DEFAULT_API_BASE = "https://transfermarkt-api.fly.dev"  # Or local instance: http://localhost:8000

ROMANIAN_CLUBS_TM_IDS = {
    "fcsb": 301,
    "dinamo": 285,
    "rapid": 243,
    "cfr": 7710,
    "craiova": 40812,
    "farul": 24473,
    "petrolul": 9407,
    "uta": 11623,
    "otelul": 4750,
    "vaslui": 8225,
    "urziceni": 10582
}


def normalize_text(text: str) -> str:
    """Removes diacritics and normalizes text for search indexing."""
    nfkd = unicodedata.normalize('NFKD', text.lower())
    return "".join([c for c in nfkd if not unicodedata.combining(c)]).strip()


def load_players() -> List[Dict[str, Any]]:
    if not DATA_FILE.exists():
        return []
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_players(players: List[Dict[str, Any]]) -> None:
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(players, f, indent=2, ensure_ascii=False)
    print(f"✅ Baza de date actualizată cu succes ({len(players)} jucători în {DATA_FILE.name})!")


def search_player_tm(api_base: str, query: str) -> List[Dict[str, Any]]:
    """Searches Transfermarkt API for a player query."""
    url = f"{api_base}/players/search/{query}"
    print(f"📡 Căutare pe {url}...")
    try:
        resp = httpx.get(url, timeout=10.0)
        resp.raise_for_status()
        data = resp.json()
        return data.get("results", [])
    except Exception as e:
        print(f"⚠️ Eroare la apelul API: {e}")
        return []


def fetch_player_transfers(api_base: str, player_id: int) -> List[Dict[str, Any]]:
    """Fetches transfer history for a specific player."""
    url = f"{api_base}/players/{player_id}/transfers"
    try:
        resp = httpx.get(url, timeout=10.0)
        resp.raise_for_status()
        data = resp.json()
        return data.get("transfers", [])
    except Exception as e:
        print(f"⚠️ Eroare la obținerea transferurilor pentru ID {player_id}: {e}")
        return []


def verify_database():
    """Verifies internal integrity of players.json."""
    players = load_players()
    print(f"\n🔍 Verificare integritate bază de date: {len(players)} jucători înregistrați.")
    errors = 0
    ids = set()

    for p in players:
        if p["id"] in ids:
            print(f"❌ ID duplicat găsit: {p['id']}")
            errors += 1
        ids.add(p["id"])

        if not p.get("clubs") or len(p["clubs"]) == 0:
            print(f"⚠️ Jucător fără cluburi: {p['name']}")
            errors += 1

    if errors == 0:
        print("✅ Toate datele sunt valide și corect indexate!\n")
    else:
        print(f"⚠️ S-au găsit {errors} avertismente.\n")


def main():
    parser = argparse.ArgumentParser(description="Gigi-Taka-Barcelona Data Harvester")
    parser.add_argument("--api", default=DEFAULT_API_BASE, help="Transfermarkt API base URL")
    parser.add_argument("--search", type=str, help="Caută un jucător după nume pe Transfermarkt")
    parser.add_argument("--verify-data", action="store_true", help="Verifică integritatea bazei locale")
    args = parser.parse_args()

    if args.verify_data:
        verify_database()
        return

    if args.search:
        results = search_player_tm(args.api, args.search)
        print(f"Găsit {len(results)} rezultate:")
        for r in results:
            print(f" - [{r.get('id')}] {r.get('name')} ({r.get('club', {}).get('name')})")
        return

    verify_database()
    parser.print_help()


if __name__ == "__main__":
    main()
