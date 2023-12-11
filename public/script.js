

$(document).ready(function () {
    // Manipular o envio do formulário de consulta de freelancers por cidade
    $('#freelancersPorCidadeForm').submit(function (event) {
        event.preventDefault();

        const cidade = $('#cidade').val();

        $.ajax({
            type: 'POST',
            url: '/freelancers-por-cidade',
            data: { cidade: cidade },
            success: function (result) {
                exibirResultado(result, 'resultadoFreelancersPorCidade', 'freelancersPorCidade');
            },
            error: function (err) {
                console.error(err);
            }
        });
    });

    // Consultar serviços que pagam mais de 500
    $('#consultarServicosForm').submit(function (event) {
        event.preventDefault();

        const quantidade = $('#quantidade').val();

        $.ajax({
            type: 'POST',
            url: '/servicos-mais-500',
            data: { quantidade: quantidade },
            success: function (result) {
                resultadoServicosMais500 = result;
                exibirResultado(result, 'resultadoServicosMais500', 'servicosMais500');
            },
            error: function (err) {
                console.error(err);
            }
        });
    });
    


    // Consultar número de serviços por estado
    window.consultarNumServicosPorEstado = function () {
        $.ajax({
            type: 'GET',
            url: '/num-servicos-por-estado',
            success: function (result) {
                exibirResultado(result, 'resultadoNumServicosPorEstado', 'numServicosPorEstado');
            },
            error: function (err) {
                console.error(err);
            }
        });
    };

    // Função para exibir resultados na tela
    function exibirResultado(result, elementoId, tipoConsulta) {
        const resultadoElemento = $('#' + elementoId);
        resultadoElemento.empty();
        if (tipoConsulta === "freelancersPorCidade") {
            resultadoElemento.append(`<h2>Quantidade: ${result.length}</h2>`);
        }

        if (result.length === 0) {
            resultadoElemento.append('<p>Nenhum resultado encontrado.</p>');
        } else {
            for (let i = 0; i < result.length; i++) {
                const item = result[i];

                // Ajuste esta parte de acordo com a estrutura dos seus resultados
                let descricaoFormatada;
                if (tipoConsulta === "freelancersPorCidade") {
                    
                    descricaoFormatada = `<div class="name"><h4>Nome do Freelancer:</h4> <p>${item.nome_completo}</p></div></div>`;
                } else if (tipoConsulta === "servicosMais500") {
                    descricaoFormatada = ` 
                <table class="tabela">    
                    <tr>
                        <td class="tab1">Descrição</td>
                        <td class ="tab2">${item.titulo}</td>
                    </tr>
                    <p class="linha"> - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  </p>
                    <tr class="tab">
                        <td class="tab1">Proposta</td>
                        <td class ="tab2">R$ ${item.proposta}</td>
                    </tr>
                </table>`;
                } else if (tipoConsulta === "numServicosPorEstado") {
                    descricaoFormatada = `
                    <table class="tabela">
                        <tr>
                            <td class="tab1">Estado</td> 
                            <td class ="tab2">${item.Estado}</td>
                        </tr>
                        <tr>
                            <td class="tab1">Número de Serviços</td>
                            <td class="tab2"> ${item.num_servicos}</td>
                        </tr>
                    </table>`;
                } else {
                    // Adicione mais casos conforme necessário para outros tipos de consulta
                    descricaoFormatada = JSON.stringify(item); // Padrão: mostrar JSON se o tipo não for reconhecido
                }

                resultadoElemento.append(`<p>${descricaoFormatada}</p>`);
            }
        }
    }

    // Função para criar um freelancer
    window.criarFreelancer = function () {
        const dadosFreelancer = {
            nome_completo: $('#nome_completo').val(),
            email: $('#email').val(),
            telefone: $('#telefone').val(),
            cpf_cnpj: $('#cpf_cnpj').val(),
            data_nascimento: $('#data_nascimento').val(),
            senha: $('#senha').val(),
            criado_em: $('#criado_em').val(),
            descricao: $('#descricao').val(),
            competencias: $('#competencias').val(),
            cep: $('#cep').val()
        };

        $.ajax({
            type: 'POST',
            url: '/criar-freelancer',
            data: dadosFreelancer,
            success: function (result) {
                console.log('Freelancer criado com sucesso:', result);
                alert("Freelancer criado com sucesso!");
            },
            error: function (err) {
                console.error(err);
            }
        });
    };


    // Função para criar um contratante
    window.criarContratante = function () {
        const dadosContratante = {
            nome_completo: $('#nome_completo_contratante').val(),
            CPF_CNPJ: $('#cpf_cnpj_contratante').val(),
            descricao: $('#descricao_contratante').val(),
            senha: $('#senha_contratante').val(),
            CEP: $('#cep_contratante').val(),
            email: $('#email_contratante').val(),
            telefone: $('#telefone_contratante').val(),
            criado_em: $('#criado_em_contratante').val(),
            id_servico_fk: $('#id_servico_fk').val()
        };

        $.ajax({
            type: 'POST',
            url: '/criar-contratante',
            data: dadosContratante,
            success: function (result) {
                console.log('Contratante criado com sucesso:', result);
                alert("Contratante criado com sucesso!");
            },
            error: function (err) {
                console.error(err);
            }
        });
    };

});
