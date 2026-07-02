
import requests, json
STATE = json.loads('{"gold": 500, "books": [{"id": "b1", "level": 3, "element": "fire"}], "equipped": [null, null, null, null, null, null], "highestLevelEver": 3, "stage": 4, "wave": 2, "stageHp": 100, "wizardLevel": 2, "wizardXp": 10, "skillPoints": 1, "skills": {"summonBonus": 0, "castSpeed": 1, "goldGain": 0, "critChance": 0}, "manaCrystals": 0, "prestigeCount": 0, "lastSeenServerTs": 0, "goldPerSecond": 1.5}')
TOK = "e2e_test_token_0123456789abcdefgh"
def test_unknown_token_404():
    r = requests.post(f"{TARGET_URL}/api/offline-claim", json={"token":"unknown_token_0123456789abcdef"})
    assert r.status_code == 404, r.text
def test_claim_nonnegative():
    requests.post(f"{TARGET_URL}/api/save", json={"token": TOK, "state": STATE})
    r = requests.post(f"{TARGET_URL}/api/offline-claim", json={"token": TOK})
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["gold"] >= 0 and body["cappedHours"] <= 8
test_unknown_token_404(); test_claim_nonnegative()
