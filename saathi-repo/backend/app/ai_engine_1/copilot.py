"""
Engine 1: Operator Co-Pilot Module

Returns one suggested next question and one communication tip based on
current SVI label. All logic is in config.json (copilot_rules) so it can
be updated without code changes.

DESIGN NOTE: This function is deliberately isolated so it can be swapped
for an LLM-based call (e.g., GPT-4 with transcript context) in a later
phase without modifying the rest of the engine pipeline.
"""

from typing import Optional


def get_copilot_suggestion(
    svi_label: str,
    config: dict,
    full_transcript: Optional[str] = None,
) -> dict:
    """
    Returns rule-based co-pilot guidance based on current SVI label.
    """
    rules = config.get("copilot_rules", {})
    rule = rules.get(svi_label, rules.get("LOW", {}))

    # Explanations based on triage level
    why_map = {
        "LOW": (
            "Gathers baseline facts without escalating caller anxiety.",
            "Helps establish rapport and verify caller location early."
        ),
        "MODERATE": (
            "Assesses immediate environment and potential caller isolation.",
            "Identifies if bystander or family support is present nearby."
        ),
        "HIGH": (
            "Prioritizes immediate physical safety and de-escalation.",
            "Guides the caller to a secure space while dispatch is alerted."
        ),
        "CRITICAL": (
            "Urgent crisis management and immediate police/responder dispatch.",
            "Keeps caller on the line and instructs lockdown till help arrives."
        ),
    }
    why_q, why_h = why_map.get(svi_label, why_map["LOW"])

    return {
        "suggested_question": rule.get(
            "suggested_question",
            "Kya aap mujhe apni current situation ke baare mein bata sakte hain?"
        ),
        "communication_tip": rule.get(
            "communication_tip",
            "Stay calm and reassuring. Listen carefully before responding."
        ),
        "why_this_question": why_q,
        "why_this_helps": why_h,
        "source": "rule_based",
    }
