let marvel = {
	
	oDados: {},

	bootstrap: function() { // funcao inicial, que carrega os dados a API
		const msg = document.getElementById("msg");
		const personagens = document.getElementById("personagens");
		const footer = document.getElementById("footer");

		const url = "http://gateway.marvel.com/v1/public/characters?ts=1&apikey=8f28a142c27c5360c7d20fdef601a44a&hash=27839dd1a0d7b1435e1f374973e58adf" // url de chamada da API com a chave unida para meu usuario

		$.ajax({ // requisicao do tipo GET 
			url: url,
			type: "GET",
			beforeSend: function() {
				msg.innerHTML = "Carregado..."
			},
			complete: function() { // cria link para pagina do jogo quando a requisicao estiver completa
				msg.innerHTML = "<a onclick='" + game.bootstrap(); + "'>Play the game</a>"
			},
			success: function(res) { // caso de sucesso, guardo a resposta em memoria e chamo as funcoes para renderizar o body e o footer
				marvel.oDados = res;
				marvel.body(res);
				marvel.footer(res);
			},
			error: function(erro) { // em caso de erro, exibo a mensagem no console
				const mensagem = JSON.parse(erro.responseText);
				console.error(mensagem.message);
			}
		})
	},

	body: function(res) { // funcao que cria a lista de personagens, tela inicial
		var html = '';
		html += '<div class="row">';	

		for(var i = 0; i < res.data.results.length; i++) { // loop de criacao de card de foto para cada retorno de personagem
			var atual = res.data.results[i];
			var personagem = atual.name;
			var img = atual.thumbnail.path + '/portrait_uncanny.' + atual.thumbnail.extension;
			var referencia = atual.urls[0].url;

			html += '<div class="col-sm-3">';
			html += '	<div class="panel panel-default">';
			html += '		<div class="panel-heading">';
			html += '			<h3 class="panel-title text-center">';
			html += '				<a href="' + referencia + '" target="_black">' + personagem + '</a>';
			html += '			</h3>';
			html += '		</div>';
			html += '		<div class="panel-body">';
			html += '			<img class="img-responsive img" src="' + img + '" title="' + personagem + '" />';
			html += '		</div>';
			html += '	</div>';
			html += '</div>';
		}

		html += '<div/>';

		personagens.innerHTML = html;

	},

	footer: function(res) { // funcao que imprime na tela os direitos da Marvel
		const conteudo = res.attributionHTML;
		footer.innerHTML = conteudo;

	},

};

marvel.bootstrap(); // faz carregar a funcao inicial

