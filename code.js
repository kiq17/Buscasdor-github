const input = document.querySelector('input')
const resultado = document.querySelector('.resultado')
const icone = document.querySelector('i')

const urlGit = 'https://api.github.com/users/'

icone.addEventListener('click', pegarValor)

function pegarValor() {
    let user = input.value

    if (user === '') {
        alert('Campo vazio!')
        return;
    }

    carregando()

    chamarAPI(user)
}

async function chamarAPI(user) {
    const userURL = urlGit + user
    const userRepos = `${urlGit}${user}/repos`

    try {
        let promises = await Promise.all([fetch(userURL), fetch(userRepos)])
        if(promises[0].status === 404){
            alert('Usuário não existe, verifique se você digitou corretamente.')
            limparHTML()
            input.value = ''
            return
        }
        let docUser = await promises[0].json()
        let docRepos = await promises[1].json()
        userGit(docUser)
        userGitRepos(docRepos)
    } catch (error) {
    }
}

function userGit(docUser) {
    limparHTML()
    const { name, avatar_url, bio, followers, following, public_repos } = docUser

    resultado.innerHTML = `
    <div class="foto-perfil">
    <img src="${avatar_url}"
    alt="Foto do Perfil">
    </div>
    <div class="conteudo-usuario">
                <h3 class="nome">${name}</h3>
                <p class="desc">${bio}</p>
                <div class="status">
                    <p>${followers}<span>Seguidores</span></p>
                    <p>${following}<span>Seguindo</span></p>
                    <p>${public_repos}<span>Repositórios</span></p>
                </div>
    </div>
    `
    resultado.classList.remove('ativo')

}

function userGitRepos(repos) {
    const div = document.createElement('div')
    const divSingle = document.createElement('div')
    div.classList.add('repos')
    divSingle.classList.add('rep-single')


    let starOrder = repos.sort((a,b) => b.stargazers_count - a.stargazers_count)

    let topTen = starOrder.slice(0,10)

    topTen.forEach(repositorio => {
        div.innerHTML = `<h3>Repositórios:</h3>`
        divSingle.innerHTML += `
        <a href="${repositorio.html_url}" target="_blank">${repositorio.name}</a>
        `
        div.appendChild(divSingle)
        resultado.appendChild(div)
    })
}

function limparHTML() {
    resultado.innerHTML = ''
}


function carregando(){
    resultado.classList.add('ativo')
    resultado.innerHTML = `<div class="loader">
    <span class="loader-icon"></span>
    <span class="loader-icon"></span>
    <span class="loader-icon"></span>
</div>`
}
