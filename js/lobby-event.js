// Экран лобби с игроками
function renderLobbyScreen() {
	window.app.mainNode.appendChild(templateEngine(titleTemplate()));
	window.app.mainNode.appendChild(templateEngine(lobbyScreenTemplate()));

	const screen = document.querySelector('.game');

	window.app.renderBlock('playerList', screen);
	window.app.renderBlock('startGameBtn', screen);
};


// Запрос на получения списка играков
function renderPlayersListBlock(conteiner) {
	const lobbyPlayerList = document.querySelector('.game__lobby-wrapper');
	let PLAYER_ID = 1;

	window.app.timers.push(
		setInterval(() => {
			request({
				url: `${API_URL}player-list`,
				params: {
					token: window.app.token
				},
				onSuccess: (responese) => {
					if (!responese.status === 'ok') {
						console.log('Не удалось получить список игроков');
					}
					else {
						lobbyPlayerList.innerHTML = '';

						responese.list.forEach(element => {
							const { login, wins, loses, you } = element;

							lobbyPlayerList.appendChild(
								templateEngine(playersListTemplate(login, wins, loses, PLAYER_ID))
							);

							if (you) {
								document
									.getElementById(`player${PLAYER_ID}`)
									.classList.add('game__lobby-player_you');
							}

							PLAYER_ID += 1;
						});
					}
				}
			})
		}, 1000)
	)
};

// Начало игры
function renderStartGameBtn(container) {
	window.app.mainNode.appendChild(templateEngine(startGameBtnTemplate()));

	document.querySelector('.game__start-button')
		.addEventListener('click', (event) => {
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
						console.log(responese);

						window.app.renderScreen('gameWaitScreen');
					}
				}
			});
		})
};



function lobbyScreenTemplate() {
	return {
		tag: 'div',
		cls: 'game__lobby',
		content: [
			{
				tag: 'p',
				cls: 'game__lobby-title',
				text: 'Players:',
			},
			{
				tag: 'ul',
				cls: 'game__lobby-wrapper',
			},
		],
	};
};

function playersListTemplate(username, wins, loses, id) {
	return {
		tag: 'li',
		cls: 'game__lobby-player',
		text: `${username} (W:${wins} / L:${loses})`,
		attrs: {
			id: `player${id}`,
		}
	}
};

function startGameBtnTemplate() {
	return {
		tag: 'button',
		cls: ['game__start-button', 'button'],
		text: 'GAME',
	};
};

