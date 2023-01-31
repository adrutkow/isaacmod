import { EntityType, LevelCurse, ModCallback, SoundEffect } from "isaac-typescript-definitions";
import { CardType } from "isaac-typescript-definitions/dist/src/enums/collections/subTypes";
import { PickupVariant } from "isaac-typescript-definitions/dist/src/enums/collections/variants";
import { DamageFlag } from "isaac-typescript-definitions/dist/src/enums/flags/DamageFlag";
import { spawnPickup } from "isaacscript-common";
import { SpawnCollectible } from "isaacscript-common/dist/src/classes/features/other/SpawnCollectible";
import { game } from "isaacscript-common/dist/src/core/cachedClasses";

const MOD_NAME = "isaacmod";
const icon = Sprite();
let happiness = 1


main();

function main() {
  // Instantiate a new mod object, which grants the ability to add callback functions that
  const mod = RegisterMod(MOD_NAME, 1);

  icon.Load("koreangamer.anm2", true);
  icon.Play("gaming0", true);
  icon.PlaybackSpeed = 0.5;

  // Register a callback function that corresponds to when a new run is started.
  mod.AddCallback(ModCallback.POST_GAME_STARTED, postGameStarted);
  mod.AddCallback(ModCallback.ENTITY_TAKE_DMG, onPlayerHurt, EntityType.PLAYER)
  mod.AddCallback(ModCallback.POST_TEAR_INIT, onShot)
  mod.AddCallback(ModCallback.POST_ENTITY_KILL, onPlayerKill, EntityType.PLAYER)
  mod.AddCallback(ModCallback.POST_NEW_LEVEL, playHappy)
  mod.AddCallback(ModCallback.POST_GAME_STARTED, onSpawnPlayer)

  // mod.AddCallback(ModCallback.POST_RENDER, displaySpring);
  mod.AddCallback(ModCallback.POST_RENDER, displaySpring);

  // Print a message to the "log.txt" file.
  Isaac.DebugString(`${MOD_NAME} initialized.`);

  
}

function postGameStarted() {
  Isaac.DebugString("Callback fired: POST_GAME_STARTED");
  game.GetLevel().AddCurse(LevelCurse.LOST, true);
}

function displaySpring() {
  icon.Update();
  icon.Render(Vector(71, 40), Vector(0, 0), Vector(0, 0));
  icon.Scale = Vector(0.5, 0.5)


  if (icon.IsFinished("angry0") ){
    icon.Play('gaming0', true)
  }

  if (Isaac.GetPlayer(0).IsFlying()){
    icon.Play("happy0", true)
  }
}

function hasCurse() {
  if ((game.GetLevel().GetCurses() & LevelCurse.LOST) !== 0) {
    displaySpring();
  }
}

function onPlayerHurt(entity: Entity, amount: number, damageFlags: BitFlags<DamageFlag>, source: EntityRef) {

  happiness -= 1
  if (Isaac.GetPlayer(0).IsDead()){
    icon.Play('angry1', true)
    return true
  }

  if (happiness < 0) {
    icon.Play('angry0', true)
    return true
  }

  icon.Play('gaming0', true)
  return true
}

function onShot(){
  spawnPickup(PickupVariant.TAROT_CARD, CardType.HANGED_MAN, 0)
}

function onPlayerKill(){
  icon.Play("angry1", true)
  return true
}

function playHappy() {
  icon.Play("happy0", true)
}

function onSpawnPlayer(){
  playHappy()
  happiness = 1
}