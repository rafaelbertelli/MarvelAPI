$(document).ready(function() {
    marvel.bootstrap(); // faz carregar a funcao inicial

    $("a").on("click", function(event){
		event.preventDefault()
	});

});

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
				try {
					msg.innerHTML = "Carregado..."	
				} catch (e) {}
				
			},
			complete: function() { // cria link para pagina do jogo quando a requisicao estiver completa
				try {
					var fnc = 'game.bootstrap()';
					msg.innerHTML = "<a href='game.html' onclick='" + fnc + "'>Play the game</a>"
				} catch (e) {}
					
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

			if(!atual.thumbnail.path.endsWith("image_not_available")) {
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

			
		}

		html += '<div/>';

		try {
			personagens.innerHTML = html;
		} catch (e) {}

	},

	footer: function(res) { // funcao que imprime na tela os direitos da Marvel
		const conteudo = res.attributionHTML;
		footer.innerHTML = conteudo;

	},

};

var game = {

	oDados: null,
	
	personagem: '',

	giveUp: false, 

	bootstrap: function() { // funcao inicial da pagina do jogo
		const imgQuiz = document.getElementById("imgQuiz");
		const footer = document.getElementById("footer");

		const url = "http://gateway.marvel.com/v1/public/characters?ts=1&apikey=8f28a142c27c5360c7d20fdef601a44a&hash=27839dd1a0d7b1435e1f374973e58adf" // url de chamada da API com a chave unida para meu usuario

		// $.ajax({ // requisicao do tipo GET 
		// 	url: url,
		// 	type: "GET",
		// 	success: function(res) { // caso de sucesso, guardo a resposta em memoria e chamo as funcoes para renderizar o body e o footer
		// 		game.oDados = res;
		// 		game.selecionaFigura()
		// 		game.footer();
		// 	},
		// 	error: function(erro) { // em caso de erro, exibo a mensagem no console
		// 		const mensagem = JSON.parse(erro.responseText);
		// 		console.error(mensagem.message);
		// 	}
		// })

		game.selecionaFigura();
	},

	selecionaFigura: function() {
		if(marvel.oDados) {
			var max = marvel.oDados.data.results.length; // tamanho maximo do array
			var min = 0; // tamanho minimo do array
			var aleatorio = Math.floor(Math.random() * (max - min)) + 1;

			var posicaoSelecionada = marvel.oDados.data.results[aleatorio];
			game.renderizaFigura(posicaoSelecionada);
		}
			
	}, 

	renderizaFigura: function(posicaoSelecionada) {
		if(posicaoSelecionada) {
			var nome = posicaoSelecionada.name;
			var thumb = posicaoSelecionada.thumbnail.path;
			var extension = posicaoSelecionada.thumbnail.extension;
			var img = thumb + '.' + extension;

			if(thumb.endsWith("image_not_available")) {
				game.selecionaFigura();
			} else {
				var html = '<img class="img-responsive width" src="' + img +'" />'

				game.personagem = nome;
				console.log(nome)
				imgQuiz.innerHTML = html;
			}
		}
			
	},

	// footer: function() { // funcao que imprime na tela os direitos da Marvel
	// 	if(game.oDados) {
	// 		const conteudo = game.oDados.attributionHTML;
	// 		footer.innerHTML = conteudo;
	// 	}
	// },

	responder: function() {
		var resposta = document.getElementById('resposta').value.toUpperCase();
		var nome = game.personagem.toUpperCase();
		var trapaca = game.giveUp;

		resposta = resposta ? resposta.trim() : '';

		if(resposta) {
			if(resposta === nome) { // se as respostas forem identicas
				game.outro();

				if(trapaca) {
					alert('Ok, passou com ajuda!');
				} else {
					alert('Você acertou o nome exato!');
					game.pontuacao('mais');
				}
					
			} else {
				nome = nome.replace(/\(/g, '').replace(/\)/g, '').split(' ');

				if(nome.indexOf(resposta) >= 0) {
					game.outro();

					if(trapaca) {
						alert('Ok, passou com ajuda!');
					} else {
						alert('Você acertou em partes!');
						game.pontuacao('mais');
					}	

				} else {
					alert('Errrrrrou...');

					game.outro();
					game.pontuacao('menos');
				}


					
				
			}

			game.giveUp = false;

		} else {
			document.getElementById('resposta').value = '';
		}

	}, 

	desistir: function() {
		game.giveUp = true;
		var nome = game.personagem;

		document.getElementById('resposta').value = nome;

	},

	outro: function() {
		document.getElementById('resposta').value = '';
		game.selecionaFigura();
	},

	pontuacao: function(acao) {
		var placar = parseFloat(document.getElementById('placar').innerHTML);

		if(acao === 'mais') {
			placar += 1;
			document.getElementById('placar').innerHTML = placar;

		} else if (acao === 'menos' && placar > 0) {
			placar -= 1;
			document.getElementById('placar').innerHTML = placar;
		} 

	}

}