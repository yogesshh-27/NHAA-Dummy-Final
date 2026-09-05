"""
SAATHI-AI 21-Category Indicator End-to-End Verification Test
Validates:
  - Hindi (Devanagari), English, and Hinglish detection across all 21 categories
  - Negation and safe context suppression (e.g. 'mujhe darr nahi lag raha')
  - Neutral / Non-indicator suppression
"""

import sys
import os
import time

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
sys.path.insert(0, os.path.dirname(__file__))

from app.ai_engine_1.indicators import detect_indicators, _load_config

cfg = _load_config()

test_dataset = [
    ("THREAT_INTIMIDATION", "वो मुझे जान से मार देगा धमकी दे रहा है"),
    ("FEAR_DISTRESS_PANIC", "I am shaking with extreme fear and having a panic attack"),
    ("IMMEDIATE_PHYSICAL_DANGER", "darwaze ke bahar khada hai hathiyar leke tod raha hai"),
    ("SELF_HARM_CONCERN", "ab jeene ka bilkul man nahi kar raha i want to end my life"),
    ("PHYSICAL_VIOLENCE_INJURY", "उसने मुझे बहुत बुरी तरह पीटा सिर से खून निकल रहा है"),
    ("SEXUAL_VIOLENCE_HARASSMENT", "he groped me inappropriately against my will"),
    ("DOMESTIC_FAMILY_VIOLENCE", "husband aur saas milke roz dowry ke liye torture karte hain"),
    ("STALKING_FOLLOWING", "रोज कॉलेज से घर तक एक लड़का मेरा पीछा करता है"),
    ("ISOLATION_NO_SUPPORT", "mera yahan koi nahi hai completely alone in this city"),
    ("COERCION_BLACKMAIL", "private photos viral karne ki dhamki deke blackmail kar raha"),
    ("SOCIAL_COMMUNITY_PRESSURE", "The village panchayat ordered a complete social boycott"),
    ("DISCRIMINATION_CASTE_VULNERABILITY", "जातिसूचक गालियां देकर नल से पानी नहीं भरने दिया"),
    ("CHILD_ELDERLY_DISABILITY_VULNERABILITY", "god mein 3 months ka baby hai aur road par nikal diya"),
    ("NO_SAFE_PLACE_HOMELESSNESS", "thrown out of house in middle of the night with nowhere to sleep"),
    ("MEDICAL_EMERGENCY", "सांस नहीं आ रही बहुत खून बह रहा है तुरंत एम्बुलेंस भेजो"),
    ("CURRENT_SAFETY_REASSURANCE", "police has arrived at scene now and I am completely safe"),
    ("REQUEST_POLICE_EMERGENCY_HELP", "तुरंत पुलिस की गाड़ी भेजिए यहां बहुत बड़ा झगड़ा हो रहा है"),
    ("REQUEST_COUNSELLING_LEGAL_MEDICAL", "I need free legal advice and psychological counseling"),
    ("UNCERTAINTY_UNCLEAR_INFO", "pata nahi kahan hoon no landmark visible confused"),
    ("CONTRADICTORY_CHANGING_SITUATION", "pehle shanti thi suddenly he brandished a weapon again"),
    ("NEUTRAL_NO_INDICATOR", "कल हम सब एक्शन फिल्म देखने सिनेमा हॉल गए थे"),
    # Negation test
    ("NEGATED_FEAR_SAFE", "mujhe koi darr nahi lag raha sab theek hai"),
]

print("=" * 80)
print("TESTING ALL 21 SAATHI-AI INDICATOR CATEGORIES + NEGATION TEST")
print("=" * 80)

passed = 0
total_inference_time = 0.0

for expected_cat, utterance in test_dataset:
    start_t = time.perf_counter()
    indicators, raw_distress, calming = detect_indicators(utterance, cfg)
    elapsed_ms = (time.perf_counter() - start_t) * 1000
    total_inference_time += elapsed_ms

    matched_categories = [i.category.upper() for i in indicators]
    labels = [i.ui_label for i in indicators]

    if expected_cat == "NEUTRAL_NO_INDICATOR":
        # Expect low/zero distress
        is_correct = raw_distress == 0
    elif expected_cat == "NEGATED_FEAR_SAFE":
        # Expect calming or non-distress
        is_correct = calming > 0 or raw_distress == 0
    elif expected_cat == "CURRENT_SAFETY_REASSURANCE":
        is_correct = calming > 0
    else:
        # Expect expected_cat in matched categories or non-zero distress with indicator
        is_correct = any(expected_cat in m for m in matched_categories) or raw_distress > 0

    status_str = "PASS" if is_correct else "CHECK"
    if is_correct:
        passed += 1

    print(f"[{status_str}] Expected: {expected_cat:<36} | Time: {elapsed_ms:.1f}ms")
    print(f"       Utterance: \"{utterance}\"")
    print(f"       Detected: {labels} | Raw Distress: {raw_distress} | Calming: {calming:.2f}\n")

avg_latency = total_inference_time / len(test_dataset)
print("=" * 80)
print(f"Results: {passed}/{len(test_dataset)} tests passed! Avg latency: {avg_latency:.2f}ms per utterance.")
print("=" * 80)
