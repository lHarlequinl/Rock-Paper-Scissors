const API_URL = 'https://skypro-rock-scissors-paper.herokuapp.com/';

window.app = {
	blocks: {},
	screens: {},
	timers: [],
	clearTimers: clearTimers,

	renderScreen: (screenName) => {
		if (!screens[screenName])
			console.log('Такого экрана нет!');

		//Сброс таймеров
		clearTimers();

		window.app.mainNode.replaceChildren();

		screens[screenName]();
	},
	renderBlock: (blockName, container) => {
		if (!blocks[blockName])
			console.log('Такого блока нет!');

		blocks[blockName](container);
	},
	player: {},
	mainNode: document.querySelector('.game'),
};

const blocks = window.app.blocks;
const screens = window.app.screens;


// LOGIN
screens['startScreen'] = renderStartScreen;
blocks['createBtn'] = renderCreateButton;

// LOBBY
screens['lobbyScreen'] = renderLobbyScreen;
blocks['startGameBtn'] = renderStartGameBtn;
blocks['playerList'] = renderPlayersListBlock;

// LOADER
screens['gameWaitScreen'] = renderGameWaitScreen;
blocks['gameStatusBlock'] = renderGameWaitBlock;

blocks['goToLobby'] = renderGoToLobby;

//GAME
screens['moveScreen'] = renderMoveScreen;
screens['moveLoader'] = renderMoveLoaderScreen;
screens['loseScreen'] = renderLoseScreen;
screens['winScreen'] = renderWinScreen;
screens['drawBlock'] = renderDrawScreen;

blocks['playAgain'] = renderPlayAgain;
blocks['versusBlock'] = renderVersusBlock;
blocks['waitEnemyMove'] = renderWaitEnemyMoveBlock;



function clearTimers() {
	if (window.app.timers.length > 0) {
		window.app.timers.forEach((timer) => clearInterval(timer));
		window.app.timers = [];
	}
};

function initApp() {
	window.app.renderScreen('startScreen');
};

initApp();