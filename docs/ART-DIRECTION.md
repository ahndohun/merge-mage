# Merge Mage — Art Direction (Director-locked, v1)

모든 시각 작업은 이 문서를 따른다. 위반 = 반려.

## 팔레트 (0x72 GrafxKid 계열 기준)
- 배경 최암부 `#100e14`, UI 배경 `#1a1721`, 패널 `#241e2e`, 패널 프레임 `#4a3f63` / 하이라이트 `#73648c`
- 텍스트 기본 `#e8e0d8`, 딤 `#9a8fa8`
- 골드/재화 `#e6b450`, 위험/보스 `#c4344a`
- 원소: fire `#e25822` / frost `#6ecbff` / holy `#ffd873`

## 스프라이트 소스 (스테이징: ~/projects/merge-mage-assets-staging)
- 히어로: `wizard-pack/Wizard Pack/` — Idle(6f), Attack1(8f)=시전, Hit(4f), Death(7f). 좌측 배치, 우향.
- 몹(스테이지 밴드별 로테이션): `dungeon-tileset/.../frames/` — imp_*, goblin_*, skelet_*, chort_*, wogol_*, zombie_*, orc_warrior_* (idle/run 4f)
- 보스: big_demon_*, big_zombie_*, ogre_* (2x 스케일)
- 마법서 아이콘: `tiny-tomes/.../16x16/` — fire=TomeOfFire, frost=TomeOfFrost(없으면 Water/Ice 계열), holy=TomeOfDivine/Light. 레벨은 아이콘 위 숫자 라벨(DungeonFont)로 표기, 레벨 10 단위로 톰 테마 승급.
- VFX: `magic-vfx/`(Foozle) fire/water(→frost 틴트)/wind, `holy-vfx/`(pimen) holy. 임팩트+발사체.
- 전장 타일: `dungeon-tileset` 바닥/벽으로 상단 전투부 배경 구성 (어둡게, 시선은 유닛에).
- 폰트: `dungeon-font/DungeonFont.ttf` 전역 (HUD·데미지 숫자·버튼 전부).
- BGM: `bgm-pack/` 중 던전 톤 1곡 루프(디렉터가 선곡: "03" 계열 후보, 통합 시 확정). SFX: `sfx-pack/` hit/coin/confirm/boss.

## 렌더링 규칙
- Phaser `pixelArt: true`, 모든 스케일 정수배, 회전 대신 플립.
- UI는 나인슬라이스 픽셀 프레임 (다크 판타지 GUI 팩 도착 시 적용; Kenney는 다크 리컬러 폴백).
- 시스템 폰트·이모지·CSS 그라데이션·기본 브라우저 버튼 스타일 금지.
- 캔버스/DOM 어디서든 "웹페이지"처럼 보이면 실패. 레퍼런스 밀도: Idle Sword Master 스크린샷 (scratchpad/ism-shots).

## 라이선스 대장 (CREDITS.md에 최종 기입)
- Wizard Pack — LuizMelo, CC0
- 0x72 DungeonTileset II — 0x72, CC0
- Tiny Tomes — BigWander, free/NYOP (재배포 금지, 게임 임베드 허용)
- Pixel Magic Effects — Foozle, CC0
- Holy Spell Effect — pimen, free (크레딧 권장)
- DungeonFont — vrtxrry, CC0
- SFX ×25 — JDWasabi, free (크레딧 권장)
- 8-bit Musics — HydroGene, CC0
