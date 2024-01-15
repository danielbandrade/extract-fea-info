const axios = require('axios');
const cheerio = require('cheerio');
const { read } = require('fs');
const ObjectsToCsv = require('objects-to-csv');

const urlWithPage = "https://www.fea.usp.br/economia/pessoas?field_nome_completo_value=&field_area_de_pesquisa_nid=All&field_linhas_de_pesquisa_nid=All&page=1";

const urlWithoutPage = "https://www.fea.usp.br/economia/pessoas?field_nome_completo_value=&field_area_de_pesquisa_nid=All&field_linhas_de_pesquisa_nid=All&page=";

const professorsList = [];
const professors = [];


async function readPage (url){

    await axios.get(url)
    .then(response => {
    const  $ = cheerio.load(response.data);

    // Adapte os seletores CSS de acordo com a estrutura HTML da página
    $('.view-pessoas-linha').each((index, element) => {

        const name = $(element).find('.views-field.views-field-field-nome-completo.view-pessoas-titulo').text().trim();
        const researchArea = $(element).find('.views-field.views-field-field-area-de-pesquisa.view-pessoas-miolo').text().trim();
        //const lattes = $(element).find('.views-field.views-field-field-curriculo-lattes.view-pessoas-miolo').text.trim(); 
        const mail = $(element).find('.views-field-mail-1').text().trim('');
        // const nome = $(element).find('.views-field.views-field-field-nome-completo.view-pessoas-titulo').text().trim();
        // const nome = $(element).find('.views-field.views-field-field-nome-completo.view-pessoas-titulo').text().trim();


        const infoProfessor = {
        'name': name,
        'researchArea': researchArea,
        //'lattes': lattes,
        'mail': mail

        };

        professors.push(infoProfessor);

    });

    // professors.forEach(professor => {
    //      console.log(professor);
    //  });

    return professors;

    })
    .catch(error => {
    console.error("Error in request", error);
    });

}


async function readPageAsync (url){

    const result = await readPage(url)

    return result;

}



for(let i=1; i<3; i++){

    const forUrl =  urlWithoutPage + i;

    const returningProfessors = readPageAsync(forUrl);
    console.log(returningProfessors);

}

console.log(returningProfessors);

// Run asynchronously, without awaiting:
new ObjectsToCsv(professorsList).toDisk('./fea-professors.csv');
 

// readPage(url);







