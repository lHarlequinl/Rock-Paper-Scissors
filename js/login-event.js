// Экран создания логина
function renderStartScreen() {
	window.app.mainNode.appendChild(templateEngine(titleTemplate()));
	window.app.mainNode.appendChild(templateEngine(startScreenTemplate()));

	window.app.renderBlock('createBtn', document.querySelector('.game__sign-up-form'));
};


// Запрос на статус игрока 
function renderCreateButton(container) {
	container.appendChild(templateEngine(createBtnTemplate()));

	const buttonLogin = document.querySelector('.game__sign-up-button');
	const newUserLogin = container.querySelector('.game__sign-up-username');

	buttonLogin.addEventListener('click', (event) => {
		event.preventDefault();

		if (newUserLogin.value === '') {
			console.log('Нужно придумать логин');
			newUserLogin.classList.add('game__sign-up-username_error');
		}
		else {
			newUserLogin.classList.remove('game__sign-up-username_error');

			//Получем токен
			request({
				url: `${API_URL}login`,
				params: {
					login: newUserLogin.value
				},
				onSuccess: (responese) => {
					if (!responese.status === 'ok') {
						console.log("Авторизация не выполнена");
					}

					else {
						window.app.player.userName = newUserLogin.value;
						const userToken = responese.token;
						window.app.token = userToken;

						//Проверяем статус игрока
						request({
							url: `${API_URL}player-status`,
							params: {
								token: userToken
							},
							onSuccess: (responese) => {
								if (!responese.status === 'ok') {
									console.log('Не удалось получить статус игрока');
								}

								else {
									if (responese['player-status'].status === 'lobby') {
										console.log('lobby');
										window.app.renderScreen('lobbyScreen');
									}

									else {
										window.app.gameId = responese['player-status'].game.id;
										window.app.renderScreen('moveScreen');
									}
								}
							}
						})
					}
				}
			})
		}
	})
};



function titleTemplate() {
	return {
		tag: 'h1',
		cls: 'game__title',
		text: 'Welcome to Rock-Paper-Scissors Game',
	}
}

function startScreenTemplate() {
	return {
		tag: 'form',
		cls: 'game__sign-up-form',
		content: [
			{
				tag: 'input',
				cls: 'game__sign-up-username',
				attrs: {
					type: 'text',
					placeholder: 'Enter your username',
					maxlength: '17',
					required: '',
				},
			},
		],
	};
};

function createBtnTemplate() {
	return {
		tag: 'button',
		cls: ['game__sign-up-button', 'button'],
		content: 'LOG IN',
	};
};