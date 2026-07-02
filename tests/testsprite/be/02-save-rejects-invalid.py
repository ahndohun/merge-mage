
import requests, json
STATE = json.loads('{"gold": 500, "books": [{"id": "b1", "level": 3, "element": "fire"}], "equipped": [null, null, null, null, null, null], "highestLevelEver": 3, "stage": 4, "wave": 2, "stageHp": 100, "wizardLevel": 2, "wizardXp": 10, "skillPoints": 1, "skills": {"summonBonus": 0, "castSpeed": 1, "goldGain": 0, "critChance": 0}, "manaCrystals": 0, "prestigeCount": 0, "lastSeenServerTs": 0, "goldPerSecond": 1.5}')
def test_rejects_negative_gold():
    bad = dict(STATE); bad["gold"] = -5
    r = requests.post(f"{TARGET_URL}/api/save", json={"token":"e2e_test_token_0123456789abcdefgh","state":bad})
    assert r.status_code == 400, r.text
def test_rejects_absurd_stage():
    bad = dict(STATE); bad["stage"] = 999999
    r = requests.post(f"{TARGET_URL}/api/save", json={"token":"e2e_test_token_0123456789abcdefgh","state":bad})
    assert r.status_code == 400, r.text
def test_rejects_short_token():
    r = requests.post(f"{TARGET_URL}/api/save", json={"token":"short","state":STATE})
    assert r.status_code == 400, r.text
test_rejects_negative_gold(); test_rejects_absurd_stage(); test_rejects_short_token()
