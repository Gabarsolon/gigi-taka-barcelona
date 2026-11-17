#!/usr/bin/env python3
"""
Gigi-Taka-Barcelona - Football Data Harvester using transfermarkt-api
Directly queries Transfermarkt JSON API to fetch and enrich players.json.

Usage:
  python scripts/harvest_tm.py --verify-data
  python scripts/harvest_tm.py --harvest
"""

import sys
import json
import asyncio
import unicodedata
from pathlib import Path
from typing import Dict, List, Any, Set, Optional

try:
    from transfermarkt_api import Transfermarkt
except ImportError:
    print("❌ Erorare: pachetul transfermarkt-api nu este instalat. Rulați 'pip install transfermarkt-api'", flush=True)
    sys.exit(1)

DATA_FILE = Path(__file__).resolve().parent.parent / "src" / "data" / "players.json"

# Mapping from Transfermarkt club names to Gigi-Taka-Barcelona criterion IDs
CLUB_PATTERNS = {
    "fcsb": ["fcsb", "steaua bucuresti", "sc fcsb", "fc steaua", "steaua"],
    "dinamo": ["dinamo bucuresti", "fc dinamo", "dinamo 1948", "dinamo"],
    "rapid": ["rapid bucuresti", "fc rapid", "rapid 1923", "rapid"],
    "cfr": ["cfr cluj", "cfr 1907 cluj", "cfr"],
    "craiova": ["universitatea craiova", "cs u craiova", "fc u craiova", "u craiova 1948", "universitatea craiova 1948"],
    "farul": ["farul constanta", "fc viitorul", "viitorul constanta", "fc farul", "farul"],
    "petrolul": ["petrolul ploiesti", "fc petrolul", "petrolul"],
    "uta": ["uta arad", "fc uta", "uta"],
    "otelul": ["otelul galati", "sc otelul", "otelul"],
    "vaslui": ["fc vaslui", "vaslui"],
    "urziceni": ["unirea urziceni", "fc unirea urziceni", "urziceni"],
    "astra": ["astra giurgiu", "astra ploiesti", "fc astra", "astra"],
    "timisoara": ["poli timisoara", "politehnica timisoara", "fc timisoara"],
    "arges": ["fc arges", "arges pitesti", "arges"],
    "bistrita": ["gloria bistrita", "bistrita"],
    # Foreign clubs with Romanian history
    "barcelona": ["fc barcelona", "barcelona"],
    "realmadrid": ["real madrid"],
    "inter": ["inter milan", "fc internazionale", "internazionale", "inter"],
    "galatasaray": ["galatasaray", "galatasaray sk"],
    "ajax": ["afc ajax", "ajax amsterdam", "ajax"],
    "chelsea": ["chelsea fc", "chelsea"],
    "fiorentina": ["acf fiorentina", "fiorentina"],
    "parma": ["parma calcio 1913", "parma fc", "parma ac", "parma"]
}

SERIE_A_CLUBS = {
    "inter", "fiorentina", "parma", "ac milan", "milan", "juventus", "as roma", "roma",
    "ss lazio", "lazio", "ssc napoli", "napoli", "atalanta", "genoa cfc", "genoa",
    "uc sampdoria", "sampdoria", "udinese calcio", "udinese", "bologna fc", "bologna",
    "cagliari calcio", "cagliari", "empoli fc", "empoli", "us lecce", "lecce",
    "us sassuolo", "sassuolo", "torino fc", "torino", "hellas verona", "verona",
    "brescia calcio", "brescia", "as bari", "bari", "calcio catania", "catania",
    "cesena fc", "cesena", "chievo verona", "as livorno", "reggina 1914", "ac siena",
    "benevento calcio", "us cremonese", "spezia calcio", "ac monza", "salernitana"
}

POSITION_MAP = {
    "Goalkeeper": "Portar",
    "Centre-Back": "Fundaș Central",
    "Left-Back": "Fundaș Stânga",
    "Right-Back": "Fundaș Dreapta",
    "Defensive Midfield": "Mijlocaș Defensiv",
    "Central Midfield": "Mijlocaș Central",
    "Attacking Midfield": "Mijlocaș Ofensiv",
    "Left Winger": "Extremă Stânga",
    "Right Winger": "Extremă Dreapta",
    "Centre-Forward": "Atacant",
    "Second Striker": "Atacant Secund"
}

# 65 high-value targets to query and add
TARGET_PLAYERS_SEARCH = [
    # Top Stars
    ("Florin Tanase", "tanase_florin", False),
    ("Alexandru Mitrita", "mitrita", True),
    ("Andrei Ivan", "ivan_andrei", False),
    ("Nicusor Bancu", "bancu", False),
    ("Louis Munteanu", "munteanu_louis", False),
    ("Denis Dragus", "dragus_denis", False),
    ("Olimpiu Morutan", "morutan", False),
    ("Florin Nita", "nita_florin", False),
    ("Horatiu Moldovan", "moldovan_horatiu", False),
    ("Deian Sorescu", "sorescu", False),
    ("Alexandru Maxim", "maxim_alexandru", False),
    ("Claudiu Petrila", "petrila", False),
    ("Cristian Manea", "manea_cristian", False),
    ("Marius Marin", "marin_marius", False),
    ("Stefan Tarnovanu", "tarnovanu", False),
    ("David Miculescu", "miculescu", False),
    ("Adrian Sut", "sut_adrian", False),
    ("Mihai Lixandru", "lixandru", False),
    ("Alexandru Chipciu", "chipciu", False),
    ("Dan Nistor", "nistor", False),
    ("Paul Papp", "papp", False),
    ("Gicu Grozav", "grozav", False),
    ("Ovidiu Hoban", "hoban", False),
    ("George Tucudean", "tucudean", True),
    ("Ianis Zicu", "zicu", True),
    ("Gigel Bucur", "bucur_gigel", True),
    ("Dan Alexa", "alexa_dan", False),
    ("Romeo Surdu", "surdu_romeo", True),
    ("Gabriel Enache", "enache_gabriel", False),
    ("Fernando Varela", "varela_fernando", False),
    ("Filipe Teixeira", "teixeira_filipe", True),
    ("Junior Morais", "junior_morais", False),
    ("Lukasz Szukala", "szukala_lukasz", False),
    ("Dayro Moreno", "dayro_moreno", True),
    ("Cyril Thereau", "thereau_cyril", True),
    ("Beto", "beto_portar", False),
    ("Damjan Djokovic", "djokovic_damjan", False),
    ("Panagiotis Tachtsidis", "tachtsidis", True),
    ("Philip Otele", "otele_philip", False),
    ("Ermal Krasniqi", "krasniqi_ermal", False),
    ("Albion Rrahmani", "rrahmani_albion", False),
    ("Lacina Traore", "traore_lacina", True),
    ("Yssouf Kone", "kone_yssouf", True),
    ("Alvaro Pereira", "pereira_alvaro", True),
    ("Emmanuel Culio", "culio_emmanuel", True),
    ("Roberto De Zerbi", "de_zerbi_roberto", True),
    ("Modou Sougou", "sougou_modou", True),
    ("Geraldo Alves", "geraldo_alves", False),
    ("Eric Bicfalvi", "bicfalvi_eric", False),
    ("Ionut Nedelcearu", "nedelcearu_ionut", False),
    ("Alexandru Pascanu", "pascanu_alexandru", False),
    ("Valentin Costache", "costache_valentin", False),
    ("Andrea Compagno", "compagno_andrea", False),
    ("Marko Dugandzic", "dugandzic_marko", False),
    ("Tibor Selymes", "selymes_tibor", True),
    ("Constantin Galca", "galca_costel", True),
    ("Basarab Panduru", "panduru_basarab", True),
    ("Daniel Prodan", "prodan_didi", True),
    ("Anton Dobos", "dobos_toni", True),
    ("Ionel Ganea", "ganea_ionel", True),
    ("Sabin Ilie", "ilie_sabin", False),
    ("Claudiu Raducanu", "raducanu_claudiu", True),
    ("Marian Aliuta", "aliuta_marian", True)
]


def normalize_text(text: str) -> str:
    nfkd = unicodedata.normalize('NFKD', text.lower())
    return "".join([c for c in nfkd if not unicodedata.combining(c)]).strip()


def match_club_id(club_name: str) -> Optional[str]:
    clean = normalize_text(club_name)
    for criterion_id, aliases in CLUB_PATTERNS.items():
        for alias in aliases:
            if alias in clean or clean in alias:
                return criterion_id
    return None


def is_serie_a(club_name: str) -> bool:
    clean = normalize_text(club_name)
    for c in SERIE_A_CLUBS:
        if c in clean:
            return True
    return False


async def harvest_player(tm: Transfermarkt, query: str, player_custom_id: str, is_cult: bool) -> Optional[Dict[str, Any]]:
    try:
        search_res = await asyncio.wait_for(tm.search_players(query), timeout=8.0)
        if not search_res.results:
            return None

        tm_player = search_res.results[0]
        tm_id = tm_player.id

        # Fetch profile, transfers, and national career concurrently in parallel
        prof_res, trans_res, nat_res = await asyncio.wait_for(
            asyncio.gather(
                tm.player_profile(tm_id),
                tm.player_transfers(tm_id),
                tm.player_national_career(tm_id),
                return_exceptions=True
            ),
            timeout=10.0
        )

        profile = prof_res if not isinstance(prof_res, Exception) else None
        transfers = trans_res.transfers if (not isinstance(trans_res, Exception) and hasattr(trans_res, "transfers")) else []
        national_teams = nat_res.national_teams if (not isinstance(nat_res, Exception) and hasattr(nat_res, "national_teams")) else []

        if not profile:
            return None

        # Extract clubs
        matched_clubs: Set[str] = set()
        has_serie_a = False

        for t in transfers:
            if t.club_from and t.club_from.name:
                cid = match_club_id(t.club_from.name)
                if cid:
                    matched_clubs.add(cid)
                if is_serie_a(t.club_from.name):
                    has_serie_a = True

            if t.club_to and t.club_to.name:
                cid = match_club_id(t.club_to.name)
                if cid:
                    matched_clubs.add(cid)
                if is_serie_a(t.club_to.name):
                    has_serie_a = True

        if profile.club and profile.club.name:
            cid = match_club_id(profile.club.name)
            if cid:
                matched_clubs.add(cid)
            if is_serie_a(profile.club.name):
                has_serie_a = True

        # National Caps
        caps = 0
        goals = 0
        for team in national_teams:
            if team.name and "romania" in team.name.lower() and "u" not in team.name.lower():
                caps = max(caps, team.appearances or 0)
                goals = max(goals, team.goals or 0)

        # Achievements
        achievements = []
        if caps >= 15:
            achievements.append("romania_national")
        if has_serie_a:
            achievements.append("serie_a")

        birth_year = profile.date_of_birth.year if profile.date_of_birth else None
        if birth_year and birth_year <= 1974 and caps >= 20:
            achievements.append("golden_generation")

        pos_en = profile.position.main if (profile.position and profile.position.main) else "Midfielder"
        pos_ro = POSITION_MAP.get(pos_en, "Fotbalist")

        nat_code = "RO" if (profile.citizenship and "Romania" in profile.citizenship) else (profile.citizenship[0] if profile.citizenship else "RO")
        normalized = normalize_text(f"{profile.name} {query}")

        return {
            "id": player_custom_id,
            "name": profile.name,
            "normalizedName": normalized,
            "displayName": profile.name,
            "clubs": sorted(list(matched_clubs)),
            "nationalCaps": caps,
            "nationalGoals": goals,
            "achievements": achievements,
            "birthYear": birth_year,
            "position": pos_ro,
            "nationality": nat_code,
            "photoUrl": str(profile.image_url) if profile.image_url else None,
            "isCultHero": is_cult
        }
    except Exception as e:
        print(f"⚠️ Eroare la {query}: {e}", flush=True)
        return None


def atomic_save(data: Any, path: Path):
    tmp_path = path.with_suffix(".tmp")
    with open(tmp_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    tmp_path.replace(path)


async def run_harvest():
    print("🚀 Pornire Harvester Transfermarkt (Parallel Fetch)...", flush=True)
    existing_players = []
    if DATA_FILE.exists():
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            existing_players = json.load(f)

    existing_by_id = {p["id"]: p for p in existing_players}
    initial_count = len(existing_by_id)
    added_count = 0
    updated_count = 0

    async with Transfermarkt() as tm:
        for idx, (query, custom_id, is_cult) in enumerate(TARGET_PLAYERS_SEARCH, 1):
            harvested = await harvest_player(tm, query, custom_id, is_cult)
            if harvested and len(harvested["clubs"]) > 0:
                if custom_id in existing_by_id:
                    curr = existing_by_id[custom_id]
                    merged_clubs = set(curr.get("clubs", []) + harvested["clubs"])
                    merged_ach = set(curr.get("achievements", []) + harvested["achievements"])
                    curr["clubs"] = sorted(list(merged_clubs))
                    curr["achievements"] = sorted(list(merged_ach))
                    if harvested.get("photoUrl"):
                        curr["photoUrl"] = harvested["photoUrl"]
                    if harvested["nationalCaps"] > curr.get("nationalCaps", 0):
                        curr["nationalCaps"] = harvested["nationalCaps"]
                    updated_count += 1
                    print(f"[{idx}/{len(TARGET_PLAYERS_SEARCH)}] 🔄 Actualizat: {harvested['name']} (Cluburi: {', '.join(curr['clubs'])})", flush=True)
                else:
                    existing_by_id[custom_id] = harvested
                    added_count += 1
                    print(f"[{idx}/{len(TARGET_PLAYERS_SEARCH)}] ✨ Adăugat NOU: {harvested['name']} (Cluburi: {', '.join(harvested['clubs'])})", flush=True)
            else:
                print(f"[{idx}/{len(TARGET_PLAYERS_SEARCH)}] ⏭️ Fără cluburi recunoscute: {query}", flush=True)

            # Save progress every 10 players
            if idx % 10 == 0:
                current_list = sorted(list(existing_by_id.values()), key=lambda x: x["name"])
                atomic_save(current_list, DATA_FILE)

            await asyncio.sleep(0.15)

    final_list = sorted(list(existing_by_id.values()), key=lambda x: x["name"])
    atomic_save(final_list, DATA_FILE)

    print(f"\n🎉 GATA! Inițial: {initial_count} -> Acum: {len(final_list)} fotbaliști (+{added_count} noi, {updated_count} actualizați)!", flush=True)


def verify_database():
    if not DATA_FILE.exists():
        print("❌ Nu există players.json!", flush=True)
        return
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        players = json.load(f)
    print(f"\n🔍 Verificare integritate: {len(players)} jucători înregistrați.", flush=True)
    no_clubs = [p["name"] for p in players if not p.get("clubs")]
    if no_clubs:
        print(f"⚠️ Jucători fără cluburi: {len(no_clubs)}", flush=True)
    else:
        print("✅ Toți fotbaliștii au cluburile corect asociate!", flush=True)


def main():
    if "--verify-data" in sys.argv:
        verify_database()
    else:
        asyncio.run(run_harvest())
        verify_database()


if __name__ == "__main__":
    main()
