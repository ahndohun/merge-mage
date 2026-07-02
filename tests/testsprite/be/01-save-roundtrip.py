
import requests, json
STATE = json.loads('{"gold": 500, "books": [{"id": "b1", "level": 3, "element": "fire"}], "equipped": [null, null, null, null, null, null], "highestLevelEver": 3, "stage": 4, "wave": 2, "stageHp": 100, "wizardLevel": 2, "wizardXp": 10, "skillPoints": 1, "skills": {"summonBonus": 0, "castSpeed": 1, "goldGain": 0, "critChance": 0}, "manaCrystals": 0, "prestigeCount": 0, "lastSeenServerTs": 0, "goldPerSecond": 1.5}')
TOK = "e2e_test_token_0123456789abcdefgh"
def test_save_roundtrip():
    r = requests.post(f"{TARGET_URL}/api/save", json={"token": TOK, "state": STATE})
    assert r.status_code == 200, r.text
    assert r.json().get("ok") is True
    g = requests.get(f"{TARGET_URL}/api/save/{TOK}")
    assert g.status_code == 200, g.text
    assert g.json()["state"]["gold"] == STATE["gold"]
test_save_roundtrip()
