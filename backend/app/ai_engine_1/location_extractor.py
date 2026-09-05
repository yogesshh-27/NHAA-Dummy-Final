"""
Engine 1: Dynamic Location Extractor for Caller Speech

Extracts Area/Street, City, District, and State from caller transcripts in:
- Hindi (e.g. "Main Lucknow se hoon", "Mera ghar Gomti Nagar mein hai")
- English (e.g. "I am from Gomti Nagar, Lucknow", "I live in Hazratganj")
- Hinglish (e.g. "Calling from Sector 62, Noida", "Main Gomti Nagar, Lucknow, UP se bol rahi hoon")

Adheres strictly to rules:
1. No guessing. If only city is mentioned, leave street and district empty.
2. Only caller speech is parsed (not operator).
3. Preserves previously confirmed location fields if subsequent speech lacks new location info.
"""

import re
from typing import Optional, Dict

# Common Indian States and their aliases
INDIAN_STATES = {
    "uttar pradesh": "Uttar Pradesh",
    "u.p.": "Uttar Pradesh",
    "up": "Uttar Pradesh",
    "up state": "Uttar Pradesh",
    "bihar": "Bihar",
    "madhya pradesh": "Madhya Pradesh",
    "m.p.": "Madhya Pradesh",
    "mp": "Madhya Pradesh",
    "delhi": "Delhi",
    "new delhi": "Delhi",
    "ncr": "Delhi-NCR",
    "delhi ncr": "Delhi-NCR",
    "rajasthan": "Rajasthan",
    "maharashtra": "Maharashtra",
    "haryana": "Haryana",
    "punjab": "Punjab",
    "uttarakhand": "Uttarakhand",
    "jharkhand": "Jharkhand",
    "chhattisgarh": "Chhattisgarh",
    "gujarat": "Gujarat",
    "west bengal": "West Bengal",
    "karnataka": "Karnataka",
    "tamil nadu": "Tamil Nadu",
}

# Major cities (especially UP / North India & metro)
KNOWN_CITIES = {
    "lucknow": "Lucknow",
    "kanpur": "Kanpur",
    "varanasi": "Varanasi",
    "banaras": "Varanasi",
    "kashi": "Varanasi",
    "prayagraj": "Prayagraj",
    "allahabad": "Prayagraj",
    "noida": "Noida",
    "greater noida": "Greater Noida",
    "ghaziabad": "Ghaziabad",
    "gorakhpur": "Gorakhpur",
    "agra": "Agra",
    "meerut": "Meerut",
    "bareilly": "Bareilly",
    "aligarh": "Aligarh",
    "moradabad": "Moradabad",
    "saharanpur": "Saharanpur",
    "ayodhya": "Ayodhya",
    "faizabad": "Ayodhya",
    "jhansi": "Jhansi",
    "muzaffarnagar": "Muzaffarnagar",
    "mathura": "Mathura",
    "firozabad": "Firozabad",
    "budaun": "Budaun",
    "rampur": "Rampur",
    "shahjahanpur": "Shahjahanpur",
    "hapur": "Hapur",
    "mirzapur": "Mirzapur",
    "sambhal": "Sambhal",
    "hardoi": "Hardoi",
    "fatehpur": "Fatehpur",
    "raebareli": "Raebareli",
    "sitapur": "Sitapur",
    "bahraich": "Bahraich",
    "unnao": "Unnao",
    "jaunpur": "Jaunpur",
    "lakhimpur": "Lakhimpur",
    "banda": "Banda",
    "pilibhit": "Pilibhit",
    "barabanki": "Barabanki",
    "gonda": "Gonda",
    "mainpuri": "Mainpuri",
    "lalitpur": "Lalitpur",
    "etah": "Etah",
    "deoria": "Deoria",
    "ghazipur": "Ghazipur",
    "sultanpur": "Sultanpur",
    "azamgarh": "Azamgarh",
    "bijnor": "Bijnor",
    "basti": "Basti",
    "ballia": "Ballia",
    "shamli": "Shamli",
    "kasganj": "Kasganj",
    "amethi": "Amethi",
    "delhi": "Delhi",
    "patna": "Patna",
    "jaipur": "Jaipur",
    "bhopal": "Bhopal",
    "indore": "Indore",
    "gurugram": "Gurugram",
    "gurgaon": "Gurugram",
    "faridabad": "Faridabad",
    "mumbai": "Mumbai",
    "kolkata": "Kolkata",
    "pune": "Pune",
}

# Known Districts that may be mentioned with or without city
KNOWN_DISTRICTS = {
    "sant kabir nagar": "Sant Kabir Nagar",
    "khalilabad": "Sant Kabir Nagar",
    "gautam buddha nagar": "Gautam Buddha Nagar",
    "kanpur nagar": "Kanpur Nagar",
    "kanpur dehat": "Kanpur Dehat",
    "lakhimpur kheri": "Lakhimpur Kheri",
    "basti": "Basti",
    "deoria": "Deoria",
    "gorakhpur": "Gorakhpur",
    "varanasi": "Varanasi",
    "lucknow": "Lucknow",
    "prayagraj": "Prayagraj",
    "agra": "Agra",
    "meerut": "Meerut",
    "aligarh": "Aligarh",
    "bareilly": "Bareilly",
    "moradabad": "Moradabad",
    "saharanpur": "Saharanpur",
    "ghaziabad": "Ghaziabad",
    "faizabad": "Ayodhya",
    "ayodhya": "Ayodhya",
    "jhansi": "Jhansi",
    "muzaffarnagar": "Muzaffarnagar",
    "azamgarh": "Azamgarh",
    "ballia": "Ballia",
    "jaunpur": "Jaunpur",
    "mirzapur": "Mirzapur",
    "sonbhadra": "Sonbhadra",
    "sitapur": "Sitapur",
    "hardoi": "Hardoi",
    "unnao": "Unnao",
    "raebareli": "Raebareli",
    "amethi": "Amethi",
    "sultanpur": "Sultanpur",
    "bahraich": "Bahraich",
    "shravasti": "Shravasti",
    "balrampur": "Balrampur",
    "gonda": "Gonda",
    "siddharthnagar": "Siddharthnagar",
    "maharajganj": "Maharajganj",
    "kushinagar": "Kushinagar",
    "chandauli": "Chandauli",
    "ghazipur": "Ghazipur",
    "mau": "Mau",
    "fatehpur": "Fatehpur",
    "kaushambi": "Kaushambi",
    "pratapgarh": "Pratapgarh",
}

# Location patterns in caller speech
LOCATION_PATTERNS = [
    # "Main Gomti Nagar, Lucknow, Uttar Pradesh se hoon / se bol rahi hoon / se bol raha hoon"
    re.compile(
        r"(?:main|mai|hum|humlog|me)\s+(?:abhi\s+)?(.+?)\s+se\s+(?:hoon|hu|hun|hain|hai|bol\s+rahi?\s+hoon|bol\s+rahe?\s+hain|call\s+kar\s+rahi?\s+hoon|aayi?\s+hoon)",
        re.IGNORECASE,
    ),
    # "I am / I'm calling from Gomti Nagar, Lucknow"
    re.compile(
        r"(?:i\s*am|i'?m|we\s*are|we'?re)\s+(?:calling\s+)?from\s+(.+?)(?:\.|\band\b|\bplease\b|\bhelp\b|\bthere\b|$)",
        re.IGNORECASE,
    ),
    # "I live in Gomti Nagar, Lucknow" / "I stay in ..."
    re.compile(
        r"(?:i|we)\s+(?:live|stay|am\s+located)\s+in\s+(.+?)(?:\.|\band\b|\bplease\b|\bhelp\b|\bthere\b|$)",
        re.IGNORECASE,
    ),
    # "Mera ghar Gomti Nagar, Lucknow mein hai"
    re.compile(
        r"(?:mera|hamara)\s+ghar\s+(?:abhi\s+)?(.+?)\s+me(?:in)?\s+hai",
        re.IGNORECASE,
    ),
    # "Main Gomti Nagar mein rehti hoon / rehta hoon"
    re.compile(
        r"(?:main|mai|hum)\s+(.+?)\s+me(?:in)?\s+(?:rehti|rehta|rehte)\s+(?:hoon|hu|hain)",
        re.IGNORECASE,
    ),
    # "Abhi main Gomti Nagar, Lucknow mein hoon"
    re.compile(
        r"(?:abhi\s+)?(?:main|mai|hum)\s+(?:abhi\s+)?(.+?)\s+(?:me(?:in)?|par|pe)\s+hoon",
        re.IGNORECASE,
    ),
    # "Calling from ..."
    re.compile(
        r"\bcalling\s+from\s+(.+?)(?:\.|\band\b|\bplease\b|\bhelp\b|\bthere\b|$)",
        re.IGNORECASE,
    ),
    # "Gomti Nagar, Lucknow se call kar rahi hoon"
    re.compile(
        r"^(.+?)\s+se\s+(?:call\s+kar\s+rahi?\s+hoon|bol\s+rahi?\s+hoon|bol\s+rahe?\s+hain)",
        re.IGNORECASE,
    ),
    # "My address is ... / Location is ... / Mera pata ..."
    re.compile(
        r"(?:my\s+(?:address|location|area)\s+is|address\s+hai|location\s+hai|(?:mera|hamara)\s+pata(?:\s+hai)?|(?:mera|hamara)\s+shehar(?:\s+hai)?)\s+(.+?)(?:\.|\band\b|\bplease\b|\bhelp\b|\bhai\b|$)",
        re.IGNORECASE,
    ),
    # "Yahan ... se bol raha hoon"
    re.compile(
        r"(?:yahan|idhar)\s+(.+?)\s+se\s+bol",
        re.IGNORECASE,
    ),
]


def clean_chunk(text: str) -> str:
    """Clean punctuation and extraneous conversational filler words."""
    t = re.sub(r"[,\.!\?]+$", "", text.strip())
    # Remove leading conversational fillers
    t = re.sub(
        r"^(?:namaste|namaskar|hello|hi|sir|madam|madamji|sirji|dekhiye|bhaiya|actually|listen|please|aur|ki)\s+",
        "",
        t,
        flags=re.IGNORECASE,
    )
    return t.strip()


def parse_location_components(raw_loc: str) -> Dict[str, str]:
    """
    Parse a candidate location string into street, city, district, state.
    e.g. "Gomti Nagar, Lucknow, Uttar Pradesh"
    """
    street = ""
    city = ""
    district = ""
    state = ""

    cleaned = clean_chunk(raw_loc)
    if not cleaned:
        return {}

    # Split by comma or " near " or " in "
    parts = [p.strip() for p in re.split(r"[,/]+|\s+near\s+|\s+in\s+", cleaned) if p.strip()]

    # 1. Look for explicit "district" / "jila" / "zila"
    remaining_parts = []
    for part in parts:
        dist_match = re.search(r"(?:district|zila|jila)\s+([A-Za-z\s]+)", part, re.IGNORECASE)
        if dist_match:
            cand = dist_match.group(1).strip()
            district = KNOWN_DISTRICTS.get(cand.lower(), cand.title())
            continue
        dist_match2 = re.search(r"([A-Za-z\s]+)\s+(?:district|zila|jila)", part, re.IGNORECASE)
        if dist_match2:
            cand = dist_match2.group(1).strip()
            district = KNOWN_DISTRICTS.get(cand.lower(), cand.title())
            continue
        remaining_parts.append(part)

    # 2. Check for State in remaining parts
    non_state_parts = []
    for part in remaining_parts:
        part_clean = part.lower().strip()
        if part_clean in INDIAN_STATES:
            state = INDIAN_STATES[part_clean]
        else:
            # Check if part ends with state e.g. "Lucknow UP"
            found_sub = False
            for s_key, s_val in INDIAN_STATES.items():
                if part_clean.endswith(" " + s_key):
                    state = s_val
                    trimmed = part[: -(len(s_key) + 1)].strip()
                    if trimmed:
                        non_state_parts.append(trimmed)
                    found_sub = True
                    break
            if not found_sub:
                non_state_parts.append(part)

    # 3. Check for City and Area/Street among remaining parts
    for part in non_state_parts:
        p_clean = part.lower().strip()
        # Direct city match
        if p_clean in KNOWN_CITIES:
            city = KNOWN_CITIES[p_clean]
        # Check if it's Sant Kabir Nagar or known district mentioned alone
        elif p_clean in KNOWN_DISTRICTS and not district:
            district = KNOWN_DISTRICTS[p_clean]
        else:
            # Check if part contains city at the end e.g. "Gomti Nagar Lucknow"
            found_city_sub = False
            for c_key, c_val in KNOWN_CITIES.items():
                # Word boundary check
                pattern = rf"\b{re.escape(c_key)}\b"
                if re.search(pattern, p_clean):
                    city = c_val
                    # The prefix is the street/area
                    prefix = re.sub(pattern, "", part, flags=re.IGNORECASE).strip()
                    prefix = re.sub(r"^[,/]+|[,/]+$", "", prefix).strip()
                    if prefix and not street:
                        street = prefix.title()
                    found_city_sub = True
                    break

            if not found_city_sub:
                # If city is already identified, or this is an area descriptor
                if not street:
                    street = part.strip().title()

    # If only 1 part was given, and it didn't match known cities, check if it's a known city
    if len(parts) == 1 and not city and not street and not district:
        p_clean = parts[0].lower().strip()
        if p_clean in KNOWN_CITIES:
            city = KNOWN_CITIES[p_clean]
        elif p_clean in KNOWN_DISTRICTS:
            district = KNOWN_DISTRICTS[p_clean]
        else:
            city = parts[0].strip().title()

    # Rule: "Do not guess a location. If only city is mentioned, leave street/district empty until actually known."
    # If street was accidentally set to the city itself, clear it
    if street and city and street.lower() == city.lower():
        street = ""

    result = {}
    if street:
        result["street"] = street
    if city:
        result["city"] = city
    if district:
        result["district"] = district
    if state:
        result["state"] = state

    return result


def extract_location(text: str, existing_location: Optional[Dict[str, str]] = None) -> Optional[Dict[str, str]]:
    """
    Extract location from a caller utterance and merge with existing location.
    Preserves last confirmed location if no new reliable location is found.
    Only self-identification location phrases from caller are parsed.
    """
    if not text or not text.strip():
        return existing_location

    text_clean = text.strip()

    # Test against defined caller conversational location patterns
    for pat in LOCATION_PATTERNS:
        match = pat.search(text_clean)
        if match:
            raw_loc = match.group(1).strip()
            parsed = parse_location_components(raw_loc)
            if parsed:
                base = dict(existing_location or {})
                # If a new city is explicitly given and differs from existing city, reset street unless newly provided
                new_city = parsed.get("city")
                old_city = base.get("city")
                if new_city and old_city and new_city.lower() != old_city.lower():
                    if "street" not in parsed:
                        base.pop("street", None)
                    if "district" not in parsed:
                        base.pop("district", None)

                for k, v in parsed.items():
                    if v:
                        base[k] = v
                base["raw_text"] = raw_loc
                return base

    # Preserve last confirmed location if no new reliable location in this chunk
    return existing_location
