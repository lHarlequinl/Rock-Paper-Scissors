// Переход на экран игры
function renderGameWaitBlock(container) {
	window.app.timers.push(
		setInterval(() => {
			request({
				url: `${API_URL}game-status`,
				params: {
					token: window.app.token,
					id: window.app.gameId
				},
				onSuccess: (responese) => {
					if (responese.status === 'ok') {
						if (responese['game-status'].status !== "waiting-for-start") {
							console.log('Game screen');

							window.app.enemyLogin = responese['game-status'].enemy.login;

							window.app.renderScreen('moveScreen');
						}
					}
					else {
						console.warn(responese.message);
					}
				}
			})
		}, 500)
	)
};

// Обратно в лобби
function renderGoToLobby(container) {
	window.app.mainNode.appendChild(templateEngine(goToLobbyBtnTemplate()));

	document.querySelector('.game__back-button')
		.addEventListener('click', () => {
			window.app.renderScreen('lobbyScreen');
		});
};

// Выбор "оружия"
function renderVersusBlock(container) {
	document.querySelector('.game__moves')
		.addEventListener('click', (event) => {
			event.preventDefault();

			const { target } = event;
			const movePlayer = target.getAttribute('data-id');

			request({
				url: `${API_URL}play`,
				params: {
					token: window.app.token,
					id: window.app.gameId,
					move: `${movePlayer}`
				},
				onSuccess: (responese) => {
					if (!responese.status === 'ok') {
						console.warn(responese.message)
					}
					else {
						const status = responese['game-status'].status;

						switch (status) {
							case "waiting-for-enemy-move":
								window.app.renderScreen('moveLoader');
								break;

							case "lose":
								window.app.renderScreen('loseScreen');
								window.app.renderBlock('playAgain');
								window.app.renderBlock('goToLobby');
								break;

							case "win":
								window.app.renderScreen('winScreen');
								window.app.renderBlock('playAgain');
								window.app.renderBlock('goToLobby');
								break;

							default:
								console.log('Ничья');
								const draw = window.app.renderScreen('drawBlock')
								window.app.timers.push(
									setInterval(() => {
										window.app.renderScreen('moveScreen');
									}, 2000)
								)
								break;
						}
					}
				}
			})
		})
};

// Играть ещё
function renderPlayAgain(container) {
	window.app.mainNode.appendChild(templateEngine(playAgainButtonTemplate()));

	document.querySelector('.game__menu-button_small')
		.addEventListener('click', () => {
			event.preventDefault();

			request({
				url: `${API_URL}start`,
				params: {
					token: window.app.token
				},
				onSuccess: (responese) => {
					if (!responese.status === 'ok') {
						console.log("token doesn't exite");
					}
					else {
						console.log('GameWaitScreen');

						window.app.gameId = responese['player-status'].game.id;

						window.app.renderScreen('moveScreen');
					}
				}
			});
		});
};

// Ожидание хода соперника
function renderWaitEnemyMoveBlock(container) {
	window.app.timers.push(
		setInterval(() => {
			request({
				url: `${API_URL}game-status`,
				params: {
					token: window.app.token,
					id: window.app.gameId
				},
				onSuccess: (responese) => {
					if (!responese.status === 'ok') {
						console.warn(responese.message)
					}
					else {
						const status = responese['game-status'].status;

						switch (status) {
							case "waiting-for-your-move":
								window.app.renderScreen('moveScreen');
								break;

							case "lose":
								window.app.renderScreen('loseScreen');
								window.app.renderBlock('playAgain');
								window.app.renderBlock('goToLobby');
								break;

							case "win":
								window.app.renderScreen('winScreen');
								window.app.renderBlock('playAgain');
								window.app.renderBlock('goToLobby');
								break;

							default:
								break;
						}
					}
				}
			})
		}, 500)
	)
};



// Ожидание подключения соперника...
function renderGameWaitScreen() {
	window.app.mainNode.appendChild(templateEngine(gameLoaderTemplate()));

	const screen = document.querySelector('.game');

	window.app.renderBlock('gameStatusBlock', screen);
	window.app.renderBlock('goToLobby', screen);
};

// Экран игры
function renderMoveScreen() {
	window.app.mainNode.appendChild(templateEngine(titlePlaysTemplate()));
	window.app.mainNode.appendChild(templateEngine(movesTemplate()));

	const screen = document.querySelector('.game');

	window.app.renderBlock('versusBlock', screen);
};

// Экран ожидание хода соперника
function renderMoveLoaderScreen() {
	window.app.mainNode.appendChild(templateEngine(moveLoaderTemplate()));

	const screen = document.querySelector('.game');

	window.app.renderBlock('waitEnemyMove', screen);
};

// Экран проигрыша
function renderLoseScreen() {
	window.app.mainNode.appendChild(templateEngine(loseTitleTemplate()));
};

// Экран победы
function renderWinScreen() {
	window.app.mainNode.appendChild(templateEngine(winTitleTemplate()));
};

// Экран ничьи
function renderDrawScreen() {
	window.app.mainNode.appendChild(templateEngine(drawTemplate()));
};



function gameLoaderTemplate() {
	return {
		tag: 'div',
		cls: 'game__loader',
		content: [
			{
				tag: 'h1',
				cls: 'game__loader-title',
				text: 'Waiting for an opponent...',
			},
			{
				tag: 'div',
				cls: 'game__lobby-loader',
			}
		]
	}
};

function goToLobbyBtnTemplate() {
	return {
		tag: 'button',
		cls: ['game__back-button', 'button'],
		content: 'Back to lobby',
	};
};

function titlePlaysTemplate(data) {
	return {
		tag: 'div',
		cls: 'game__versus',
		content: [
			{
				tag: 'h1',
				cls: 'game__enemy-player',
				text: `${window.app.player.userName} VS ${window.app.enemyLogin}`,
			},
			{
				tag: 'p',
				cls: 'game__moves-text',
				content: 'Your move!',
			},
		]
	}
};

function movesTemplate() {
	return {
		tag: 'div',
		cls: 'game__moves',
		content: [
			{
				tag: 'img',
				cls: 'game__moves-item',
				attrs: {
					'data-id': 'paper',
					alt: 'paper',
					width: '100',
					src: './img/paper.jpg',
				},
			},
			{
				tag: 'img',
				cls: 'game__moves-item',
				attrs: {
					'data-id': 'rock',
					alt: 'rock',
					width: '100',
					src: './img/rock.jpg',
				},
			},
			{
				tag: 'img',
				cls: 'game__moves-item',
				attrs: {
					'data-id': 'scissors',
					alt: 'scissors',
					width: '100',
					src: './img/scissors.jpg',
				},
			},
		],
	}
};

function moveLoaderTemplate() {
	return {
		tag: 'div',
		cls: 'game__loader-move',
		content: [
			{
				tag: 'h1',
				cls: 'game__loader-title',
				text: "Waiting for the opponent's move...",
			},
			{
				tag: 'div',
				cls: 'game__lobby-loader',
			}
		]
	}
};

function winTitleTemplate() {
	return {
		tag: 'h1',
		cls: ['game__finish-title', 'game__finish-title_win'],
		text: 'You win!!!',
	}
};

function loseTitleTemplate() {
	return {
		tag: 'h1',
		cls: ['game__finish-title', 'game__finish-title_lose'],
		text: 'You lose',
	}
};

function playAgainButtonTemplate() {
	return {
		tag: 'button',
		cls: ['game__menu-button_small', 'button'],
		text: 'Play again',
	}
};

function drawTemplate() {
	return {
		tag: 'p',
		cls: ['game__draw', 'game__finish-title'],
		text: 'DRAW!',
	}
};