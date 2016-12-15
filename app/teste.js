app.service('arvoreService', function($timeout) {

    /*
     * Retorna um array de dois elementos com os sucessores da árvore
     */
    this.calcularSucessores = function(valor) {
        var posicao = this.calcularPosicaoArvore(valor)
        var posicaoGalho, galhoSuperior, temp = 0,
            y = 1,
            array = [];

        galhoSuperior = this.calcularTotalElementos(posicao + 1, valor);

        if (posicao > 1) {
            posicaoGalho = this.calcularPosicaoFolha(posicao, valor);
        } else {
            posicaoGalho = valor;
        }

        for (var x = 1; x < posicaoGalho; x++) {
            y += 2;
        };

        temp = (galhoSuperior + y);

        array.push(temp);
        array.push(temp + 1);

        return array;
    };

    // Encontra o valor que antecede a aquela ramificaçaõ
    this.calcularAntecessor = function(valor) {
      if(valor > 6){
        var posicao = this.calcularPosicaoArvore(valor);

        var posicaoFimGalhoAnterior = this.calcularTotalElementos(posicao);

        var qtdElementosAteValor = valor - posicaoFimGalhoAnterior;

        var posicaoFimGalhoAntecessoAntecessor = this.calcularTotalElementos(posicao-1);

        var valorSoma = parseInt(qtdElementosAteValor / 2);

        if(qtdElementosAteValor % 2  !== 0){
          valorSoma += 1;
        }

        var result = posicaoFimGalhoAntecessoAntecessor + valorSoma;

      } else {
        if(valor === 3 || valor === 4){
          var result = 1;
        } else if(valor === 5 || valor === 6){
          var result = 2
        } else if(valor < 3){
          var result = null;
        }
      }

      return result;
    };

    this.calcularPosicaoFolha = function(valor) { // Define a posicao do elemento no galho

        var posicao = this.calcularPosicaoArvore(valor);
        var folhasTotaisAntecessor,
            resultado;

        folhasTotaisAntecessor = this.calcularTotalElementos(posicao, valor);

        resultado = valor - folhasTotaisAntecessor;

        return resultado;
    };

    this.calcularTotalElementos = function(posicaoGalho, valor) { // Define quantidadoes de elementos anteriores a aquele galha
        var x = 1,
            res = 0,
            fatoracao = 2;
        // Caso a posicao no galho seja maior que 1 ele realiza o loop para encontrar a quantidade de elementos totais no galho
        if (posicaoGalho > 1) {
            while (true) {
                if (x === posicaoGalho) {
                    break;
                };
                res += fatoracao;
                fatoracao *= 2;
                x++;
            };
        }

        // Se a posicao no falho for 1 ele retorna o valor 1
        if (posicaoGalho === 1) {
            res = valor;
            return valor;
        };

        if (posicaoGalho !== 1) {
            return res;
        }
    };

    /*
     * Encontra a ramificação onde fica o valor
     */
    this.calcularPosicaoArvore = function(posicao) {
        var pos = 1,
            x = 2,
            arvoreAnterior = 2,
            arvoreSucessor = 6;

        if (posicao > 2) {
            while (true) {
                pos++;

                // Compara a posicao do galho anterior, mais a posicao do galho superior se estiver entre eles a posicao foi encontrada
                if (posicao > arvoreAnterior && posicao <= arvoreSucessor) {
                    break;
                }

                // Valor a acrescentar na soma da quantidade de elementos anteriores ao galho
                x *= 2;

                arvoreAnterior += x

                arvoreSucessor = arvoreAnterior + (x * 2);
            };
        }

        return pos;
    }
});
