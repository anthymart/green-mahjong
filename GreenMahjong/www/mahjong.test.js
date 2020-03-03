import * as mj from "./js/mahjong.js";
import * as sp from "./js/spider.js";
import * as bg from "./js/bug.js";
import * as fh from "./js/fourHills.js";
import * as pts from "./js/pointCalculation.js";


// jest
//     .dontMock('./lib/jquery/jquery-2.1.0.min.js');
var $ = require('./lib/jquery/jquery-2.1.0.min.js');


test('mj.matchingGame.version', () => {
    expect(mj.matchingGame.version).toEqual("2.0");
});

test('positionX.length', () => {
    expect(sp.matchingGame.spider.positionX.length).toBeGreaterThan(22);
    expect(sp.matchingGame.spider.positionX.length).not.toBeGreaterThan(2000);
    expect(sp.matchingGame.spider.positionX.length).not.toBeLessThan(20);
});

test('selectable', () => {
    expect(bg.matchingGame.bug.selectable[0]).not.toBeTruthy();
    expect(bg.matchingGame.bug.selectable[1]).toBeTruthy();
});

test('getCardPattern', () => {
    expect(mj.getCardPattern("cardSommer")).toEqual("cardJahreszeiten");
    //if the pattern is not listed, it returns the same string
    expect(mj.getCardPattern("cardFruehling")).toEqual("cardJahreszeiten");
    expect(mj.getCardPattern("cardWinter")).toEqual("cardJahreszeiten");
    expect(mj.getCardPattern("cardPflaume")).toEqual("cardBlumen");
    expect(mj.getCardPattern("cardOrchidee")).toEqual("cardBlumen");
    expect(mj.getCardPattern("Anthony")).toEqual("Anthony");
    expect(mj.getCardPattern("")).toEqual("");
});

test('getShiftValueX', () => {
    mj.matchingGame.resolution = mj.matchingGame.resolutions.verybigscreen;
    //should return the resolution times the zIndex value
    //in these cases the resolution is 12
    expect(mj.getShiftValueX(0)).toBe(0);
    expect(mj.getShiftValueX(2)).toBe(24);
    mj.matchingGame.resolution = mj.matchingGame.resolutions.bigscreen;
    expect(mj.getShiftValueX(1)).toBe(8);
    expect(mj.getShiftValueX(3)).toBe(24);
    mj.matchingGame.resolution = mj.matchingGame.resolutions.smallscreen;
    expect(mj.getShiftValueX(-1)).toBe(-3);
    expect(mj.getShiftValueX(11)).toBe(33);
});

test('getShiftValueY', () => {
    mj.matchingGame.resolution = mj.matchingGame.resolutions.verybigscreen;
    //in these cases the resolution is 11
    expect(mj.getShiftValueY(2)).toBe(22);
    expect(mj.getShiftValueY(3)).toBe(33);
    expect(mj.getShiftValueY(4)).toBe(44);
    mj.matchingGame.resolution = mj.matchingGame.resolutions.bigscreen;
    expect(mj.getShiftValueY(2)).toBe(14);
    mj.matchingGame.resolution = mj.matchingGame.resolutions.smallscreen;
    expect(mj.getShiftValueY(2)).toBe(6);
    expect(mj.getShiftValueY(6)).toBe(18);
});

test('updatePoints', () => {
    mj.matchingGame.points = 0;
    mj.updatePoints(true);
    expect(mj.matchingGame.points).toBe(2);
    mj.matchingGame.points = 6;
    mj.updatePoints(false);
    expect(mj.matchingGame.points).toBe(4);
    mj.matchingGame.points = 8;
    mj.updatePoints(false);
    expect(mj.matchingGame.points).toBe(6);
    mj.matchingGame.points = 3.5;
    mj.updatePoints(false);
    expect(mj.matchingGame.points).toBe(1.5);
    mj.matchingGame.points = 10;
    mj.updatePoints(1);
    expect(mj.matchingGame.points).toBe(12);
});

test('resetPoints', () => {
    mj.matchingGame.points = 6;
    mj.resetPoints();
    expect(mj.matchingGame.points).toBe(0);
    mj.matchingGame.points = 7;
    mj.resetPoints();
    expect(mj.matchingGame.points).toBe(0);
    mj.matchingGame.points = -3;
    mj.resetPoints();
    expect(mj.matchingGame.points).toBe(0);
    mj.matchingGame.points = 20000;
    mj.resetPoints();
    expect(mj.matchingGame.points).toBe(0);
    mj.matchingGame.points = -3.5;
    mj.resetPoints();
    expect(mj.matchingGame.points).toBe(0);
});

test('loadBoardData', () => {
    mj.loadBoardData(sp.matchingGame.spider);
    expect(mj.matchingGame.positionX.length).toBe(144);
    expect(mj.matchingGame.positionX[0]).toBe(3.5);
    expect(mj.matchingGame.positionX[1]).toBe(4.5);

    mj.loadBoardData(bg.matchingGame.bug);
    expect(mj.matchingGame.positionX.length).toBe(144);
    expect(mj.matchingGame.positionX[0]).toBe(4.5);
    expect(mj.matchingGame.positionX[1]).toBe(5.5);

    mj.loadBoardData(fh.matchingGame.fourHills);
    expect(mj.matchingGame.positionX.length).toBe(144);
    expect(mj.matchingGame.positionX[0]).toBe(2);
    expect(mj.matchingGame.positionX[1]).toBe(3);
    expect(mj.matchingGame.positionY[13]).toBe(1);

});

test('getNumberOfLeftNeighbors', () => {
    var html = require('fs').readFileSync('./index.html').toString();
    document.documentElement.innerHTML = html;
    //if you check the html file, there should only be one dummy card div
    expect($('.card').length).toBe(1);
    //144 total tiles/cards
    expect(mj.matchingGame.deck.length).toBe(144);
    //specifically looking at the case where we are using the bug layout
    mj.loadBoardData(bg.matchingGame.bug);

    mj.startNewGame();
    //after starting the game, it populates the DOM with all the card divs
    expect($('.card').length).toBe(144);
    expect(mj.getNumberOfLeftNeighbors(14, 2.5, 0)).toBe(2);
    expect(mj.getNumberOfLeftNeighbors(1, 1.5, 2)).toBe(0);
    expect(mj.getNumberOfLeftNeighbors(6, 1.5, 0)).toBe(1);
    expect(mj.getNumberOfLeftNeighbors(-1, 1.5, 0)).toBe(0);
    expect(mj.getNumberOfLeftNeighbors(11.5, 6.5, 0)).toBe(1);
});

test('getNumberOfRightNeighbors', () => {
    var html = require('fs').readFileSync('./index.html').toString();
    document.documentElement.innerHTML = html;
    //if you check the html file, there should only be one dummy card div
    expect($('.card').length).toBe(1);
    //144 total tiles/cards
    expect(mj.matchingGame.deck.length).toBe(144);
    //specifically looking at the case where we are using the spider layout
    mj.loadBoardData(sp.matchingGame.spider);

    mj.startNewGame();
    //after starting the game, it populates the DOM with all the card divs
    expect($('.card').length).toBe(144);
    expect(mj.getNumberOfRightNeighbors(13.5, 2, 1)).toBe(1);
    expect(mj.getNumberOfRightNeighbors(12.5, 0, 1)).toBe(0);
    //since there are no cards next to it at the same level, the value should be zero
    expect(mj.getNumberOfRightNeighbors(4, 4.5, 1)).toBe(0);
    //this card has one next to it
    expect(mj.getNumberOfRightNeighbors(4, 4.5, 0)).toBe(1);
    expect(mj.getNumberOfRightNeighbors(4.5, 6, 1)).toBe(0);
});

test('getUnderlayingNeighbours', () => {
    var html = require('fs').readFileSync('./index.html').toString();
    document.documentElement.innerHTML = html;
    //specifically looking at the case where we are using the spider layout
    mj.loadBoardData(sp.matchingGame.spider);

    mj.startNewGame();
    expect(mj.getUnderlayingNeighbours(8, 4.5, 3).length).toBe(3);
    expect(mj.getUnderlayingNeighbours(15, 4.5, 2).length).toBe(1);
    expect(mj.getUnderlayingNeighbours(1.5, 1.5, 2).length).toBe(1);
    expect(mj.getUnderlayingNeighbours(-1, 4.5, 3).length).toBe(0);
    mj.loadBoardData(bg.matchingGame.bug);
    mj.startNewGame();

    expect(mj.getUnderlayingNeighbours(8, 4.5, 3).length).toBe(2);
    expect(mj.getUnderlayingNeighbours(15, 4.5, 2).length).toBe(0);
    expect(mj.getUnderlayingNeighbours(10, 3.5, 4).length).toBe(2);
    expect(mj.getUnderlayingNeighbours(-1, 4.5, 3).length).toBe(0);
    
    mj.loadBoardData(fh.matchingGame.fourHills);
    mj.startNewGame();

    expect(mj.getUnderlayingNeighbours(4.5, 6.5, 3).length).toBe(4);
    expect(mj.getUnderlayingNeighbours(15, 4.5, 0).length).toBe(0);
});

test('getNumberOfHigherOverlaps', () => {
    var html = require('fs').readFileSync('./index.html').toString();
    document.documentElement.innerHTML = html;
    mj.loadBoardData(bg.matchingGame.bug);
    mj.startNewGame();
    expect(mj.getNumberOfHigherOverlaps(3, 4, 2)).toBe(1);
    expect(mj.getNumberOfHigherOverlaps(3, 4, 3)).toBe(0);
    expect(mj.getNumberOfHigherOverlaps(3, 3, 2)).toBe(1);
    expect(mj.getNumberOfHigherOverlaps(3, 3, 3)).toBe(0);
    expect(mj.getNumberOfHigherOverlaps(9, 3.5, 0)).toBe(5);
    expect(mj.getNumberOfHigherOverlaps(3, 4, 0)).toBe(3);
    expect(mj.getNumberOfHigherOverlaps(12, 4.5, 1)).toBe(1);
});

test('isCardSelectable', () => {
    var html = require('fs').readFileSync('./index.html').toString();
    document.documentElement.innerHTML = html;
    mj.loadBoardData(sp.matchingGame.spider);
    mj.startNewGame();
    //easy function to get html element of a tile
    var tile1 = mj.getLeftNeighbours(4, 4.5, 2);
    expect(mj.isCardSelectable(tile1)).toBeTruthy();
    var tile2 = mj.getLeftNeighbours(4, 4.5, 1);
    expect(mj.isCardSelectable(tile2)).not.toBeTruthy();
    var tile3 = mj.getLeftNeighbours(-1, -3, 4);
    expect(mj.isCardSelectable(tile3)).toBeTruthy();
    var tile4 = mj.getLeftNeighbours(1, 8, 6);
    expect(mj.isCardSelectable(tile4)).toBeTruthy();
    //tile underneath another tile should not be selectable
    var tile5 = mj.getUnderlayingNeighbours(8, 4, 2);
    expect(mj.isCardSelectable(tile5)).not.toBeTruthy();
    var tile6 = mj.getLeftNeighbours(8.5, 5, 2);
    expect(mj.isCardSelectable(tile5)).not.toBeTruthy();
});

test('changeTheme', () => {
    mj.matchingGame.theme = 0;
    mj.changeTheme(1);
    expect(mj.matchingGame.theme).toBe(1);
    mj.matchingGame.theme = 1;
    mj.changeTheme();
    expect(mj.matchingGame.theme).toBe(2);
    mj.matchingGame.theme = 2;
    mj.changeTheme();
    expect(mj.matchingGame.theme).toBe(0);
    mj.matchingGame.theme = 0;
    mj.changeTheme();
    expect(mj.matchingGame.theme).toBe(1);
    mj.matchingGame.theme = 8;
    mj.changeTheme(-3);
    expect(mj.matchingGame.theme).toBe(-3);
    mj.matchingGame.theme = 8;
    mj.changeTheme();
    expect(mj.matchingGame.theme).toBe(9);
});

test('isMatchPattern', () => {
    var html = require('fs').readFileSync('./index.html').toString();
    document.documentElement.innerHTML = html;
    mj.loadBoardData(sp.matchingGame.spider);

    mj.startNewGame();
    var tiles = document.getElementsByClassName("card");
    tiles[0].classList.add("card-selected");
    tiles[1].classList.add("card-selected");
    expect(mj.isMatchPattern()).toBeTruthy();
    tiles[0].classList.remove("card-selected");
    tiles[1].classList.remove("card-selected");
    tiles[3].classList.add("card-selected");
    tiles[7].classList.add("card-selected");
    expect(mj.isMatchPattern()).not.toBeTruthy();
    tiles[3].classList.remove("card-selected");
    tiles[7].classList.remove("card-selected");
    tiles[9].classList.add("card-selected");
    tiles[10].classList.add("card-selected");
    expect(mj.isMatchPattern()).toBeTruthy();
    tiles[9].classList.remove("card-selected");
    tiles[10].classList.remove("card-selected");
    tiles[51].classList.add("card-selected");
    tiles[50].classList.add("card-selected");
    expect(mj.isMatchPattern()).toBeTruthy();
    tiles[51].classList.remove("card-selected");
    tiles[50].classList.remove("card-selected");
    tiles[6].classList.add("card-selected");
    tiles[50].classList.add("card-selected");
    expect(mj.isMatchPattern()).not.toBeTruthy();
});

test('checkPattern', () => {
    var html = require('fs').readFileSync('./index.html').toString();
    document.documentElement.innerHTML = html;
    mj.loadBoardData(sp.matchingGame.spider);

    mj.startNewGame();
    mj.matchingGame.points = 0;
    var tiles = document.getElementsByClassName("card");
    tiles[0].classList.add("card-selected");
    tiles[1].classList.add("card-selected");
    mj.checkPattern()
    var tilesRemoved = document.getElementsByClassName("card-removed");
    //it should remove the card from the selected list after matching it
    expect(tilesRemoved.length).toBe(2);
    //points should increment
    expect(mj.matchingGame.points).toBe(2);
    var tiles1 = document.getElementsByClassName("card-selected");
    expect(tiles1.length).toBe(0);
    console.log("here we go:" + tiles1);
    tiles[3].classList.add("card-selected");
    tiles[7].classList.add("card-selected");
    mj.checkPattern();
    //since these cards don't match, they should stil
    expect(tiles[7].classList.contains("card-selected")).not.toBeTruthy();
    var tilesRemoved2 = document.getElementsByClassName("card-removed");
    expect(tilesRemoved2.length).toBe(2);
    expect(mj.matchingGame.points).toBe(2);

    tiles[13].classList.add("card-selected");
    tiles[12].classList.add("card-selected");
    mj.checkPattern()
    tilesRemoved = document.getElementsByClassName("card-removed");
    //it should remove the card from the selected list after matching it
    expect(tilesRemoved.length).toBe(4);
    //points should increment
    expect(mj.matchingGame.points).toBe(4);

    tiles[21].classList.add("card-selected");
    tiles[22].classList.add("card-selected");
    mj.checkPattern()
    tilesRemoved = document.getElementsByClassName("card-removed");
    //it should remove the card from the selected list after matching it
    expect(tilesRemoved.length).toBe(6);
    //points should increment
    expect(mj.matchingGame.points).toBe(6);
    var tilesSelected= document.getElementsByClassName("card-selected");
    expect(tilesSelected.length).toBe(0);
});