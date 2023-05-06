// Выход из личного кабинета

const logoutButton = new LogoutButton();
logoutButton.action = () => {
	ApiConnector.logout(response => {
		if (response.success === true) {
			location.reload();
		}
	});
};


// Получение информации о пользователе

ApiConnector.current((response) => {
	if (response.success === true) {
		ProfileWidget.showProfile(response.data);
	}
});


// Получение текущих курсов валюты

const ratesBoard = new RatesBoard();
function  getExchangeRates() {
    ApiConnector.getStocks((response) => {
        if (response.success === true) {
		ratesBoard.clearTable();                                      // очищаем таблицу
		ratesBoard.fillTable(response.data);                          // заполняем таблицу полученными данными
        }                     
	});
}

getExchangeRates(); 

setInterval(getExchangeRates, 60000);                                


// Операции с деньгами
    // пополнение баланса
const moneyManager = new MoneyManager;
moneyManager.addMoneyCallback = (data) => {
	ApiConnector.addMoney(data, (response) => {
		if (response.success === true) {
			ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, "Баланс пополнен " + data.amount + " " + data.currency);
		} else {
			moneyManager.setMessage(response.success, "Ошибка пополнения баланса. Пожалуйста, проверьте корректность указанной суммы и валюты");
		}
	});
};
    // конвертирование валюты
moneyManager.conversionMoneyCallback = (data) => {
    ApiConnector.convertMoney(data, (response) => {
        if (response.success === true) {
			ProfileWidget.showProfile(response.data);
			moneyManager.setMessage(response.success, "Конвертация успешно выполнена!");
		} else {
			moneyManager.setMessage(response.success, "Ошибка конвертации валюты. Пожалуйста, проверьте корректность указанной суммы и выбор валют");
		}
	});
};
    // перевод валюты
 moneyManager.sendMoneyCallback = (data) => {
    ApiConnector.transferMoney(data, (response) => {
        if (response.success === true) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, "Перевод успешно выполнен!");
        } else {
            moneyManager.setMessage(response.success, "Ошибка перевода валюты. Пожалуйста, проверьте корректность указанной суммы и валюты");
        }
    });
 }


 // Работа с избранным

const favoritesWidget = new FavoritesWidget;
    // начальный список избранного
ApiConnector.getFavorites(data, (response) => {
    if (response.success === true) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        favoritesWidget.updateUsersList(response.data);
    }
});
     // добавление пользователя в список избранных   
 favoritesWidget.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, (response) => {
        if (response.success === true) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            favoritesWidget.updateUsersList(response.data);
            favoritesWidget.setMessage(response.success, "Пользователь добавлен в адресную книгу!");
        } else {
            favoritesWidget.setMessage(response.success, "Ошибка добавления в адресную книгу! Проверьте корректность введенного ID и имени пользователя");
        }
    });
 }

   