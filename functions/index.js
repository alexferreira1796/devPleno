const functions = require('firebase-functions'); // Exportando todas as funcionalidades, quando eu solicitar algo
const admin = require('firebase-admin');  // Acesso geral ao realtime

admin.initializeApp();	// Logar no firebase

/*
* firebase: objeto global
* database(): metodo de acesso ao realtime database
* ref(): url em string para referencia do caminho no banco
*/

// Estou exportando vinculado ao functions database, e na referencia vai fazer algo, quando eu escrever, 
//roda uma funcao assincrona onde vou ter (mudança e contexto)
exports.sum = functions.database.ref('/movements/{day}')
	.onWrite(async(change, context) => {
		const mesesRef = admin.database().ref('/months/'+context.params.day) // Pegando a referencia do contexto
		const movementsRef = change.after.ref // Quero a referencia depois de acontecer

		const movementsSS = await movementsRef.once('value') // Espero retornar e me da uma resposta
		const movements = movementsSS.val()

		let entradas = 0
		let saidas = 0

		Object.keys(movements).forEach(m => {
			if(movements[m].valor > 0) {
				entradas += parseFloat(movements[m].valor)
			} else {
				saidas += parseFloat(movements[m].valor)
			}
		})

		// Quero alterar esse valor, com o atual
		return mesesRef.transaction(current => { 
			if(current === null) {
				return {
					entradas,
					saidas,
					previsao_entrada: 0,
					previsao_saida: 0
				}
			}
			return {
				...current,
				entradas,
				saidas
			}
		})

	})