const input = document.querySelector('.input-busca input')
const icon = document.querySelector('.input-busca i')
const conteudo = document.querySelector('.conteiner')
const resultado = document.querySelector('.resultado')
const loader = document.querySelector('.processing')

const url = 'https://api.github.com/users/'

icon.addEventListener('click', buscarUser)

function buscarUser() {
    if (input.value === '') {
        mostrarError();
        return
    }

    chamarAPI(input.value)
}

function mostrarError() {
    input.classList.add('error')
    /*  const p = document.createElement('p')
    p.classList.add('error')
    p.innerText = msgError
    p.style.color = 'red'
    conteudo.appendChild(p) */
    setTimeout(() => input.classList.remove('error'), 1500)
}


async function chamarAPI(user) {
    const userUrl = url + user
    const reposUrl = `${url}${user}/repos`

    try {
        const doc = await Promise.all([fetch(userUrl), fetch(reposUrl)])
        if (doc[0].status === 404) {
            mostrarError();
        }
        const docUser = await doc[0].json()
        const docRepos = await doc[1].json()
        userConteudo(docUser);
        reposConteudo(docRepos);
    } catch (error) {
        console.log(error)
    }
}

function userConteudo(data) {
    limparHTML();
    const { avatar_url, followers, following, name, bio, public_repos } = data
    const divFoto = document.createElement('div')
    divFoto.classList.add('foto-perfil')
    resultado.appendChild(divFoto)


    const divConteudo = document.createElement('div')
    divConteudo.classList.add('conteudo-usuario')
    resultado.appendChild(divConteudo)

    divFoto.innerHTML = `<img src="${avatar_url}"
    alt="Foto do Perfil">`

    divConteudo.innerHTML = `<h3 class="nome">${name}</h3>
    <p class="desc">${bio}</p>
    <div class="status">
    <p>${followers}<span>Seguidores</span></p>
    <p>${following}<span>Seguindo</span></p>
    <p>${public_repos}<span>Repositórios</span></p>
    </div>
    <div class="repos">
            <h3>Repositórios:</h3>
            <div class="rep-single">
            
            </div>
    </div>`
}

function reposConteudo(cont) {
    const teste = document.querySelector('.rep-single')

    cont.sort((a, b) => b.stargazers_count - a.stargazers_count)
    const dezMais = cont.slice(0, 7)

    dezMais.forEach(e => {
        const link = document.createElement('a')
        link.innerText = e.name;
        link.href = e.html_url;
        link.target = '_blank';
        teste.appendChild(link)
    });
}

function limparHTML(){
    resultado.innerHTML = ''
}

