var sucessores = [];

function calcularSucessores(posicao, valor) {
    var posicaoGalho, galhoSuperior, temp = 0,
        y = 1, array = [];

    galhoSuperior = calcularTotalElementos(posicao + 1, valor);

    if (posicao > 1) {
        posicaoGalho = calcularPosicaoFolha(posicao, valor);
    } else {
        posicaoGalho = valor;
    }

    for (var x = 1; x < posicaoGalho; x++) {
        y += 2;
    };

    temp = (galhoSuperior + y);

    array.push(temp);
    array.push(temp+1);

    console.log("Ramificação A: " + array[0] + "| Ramificação B:" + array[1]);

    return array;
};


function calcularPosicaoFolha(posicao, valor) { // Define a posicao do elemento no galho
    var folhasTotaisAntecessor,
        resultado;

    folhasTotaisAntecessor = calcularTotalElementos(posicao, valor);

    resultado = valor - folhasTotaisAntecessor;

    return resultado;
};

function calcularTotalElementos(posicaoGalho, valor) { // Define quantidadoes de elementos anteriores aquele galh
    var x = 1,
        res = 0,
        fatoracao = 2;
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

    if (posicaoGalho === 1) {
        res = valor;
        console.log("Valor:" + valor)
        return valor;
    };
    if (posicaoGalho !== 1) {
        console.log("teste");
        return res;
    }
};

function calcularPosicaoArvore(posicao) { // Correto
    var pos = 1,
        x = 2,
        arvoreAnterior = 2,
        arvoreSucessor = 6;

    if (posicao > 2) {
        while (true) {
            pos++;
            if (posicao > arvoreAnterior && posicao <= arvoreSucessor) {
                break;
            }

            x *= 2;

            arvoreAnterior += x

            arvoreSucessor = arvoreAnterior + (x * 2);
        };
    }

    return pos;
}

var posicao = calcularPosicaoArvore(1);

calcularPosicaoFolha(posicao, 1);

array = calcularSucessores(posicao, 1)
