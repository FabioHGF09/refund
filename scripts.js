// Seleciona os elementos do formulário
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

//Seleciona os elementos da Lista

const expenseList = document.querySelector("ul")
const expenseQuatity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")

// Captura o evento de input para formatar o valor.
amount.oninput = () =>{
  let value = amount.value.replace(/\D/g,"")

  value = Number(value) / 100

  amount.value = formatCurrencyBRL(value)
}

//Formata o valor para BRL.
function formatCurrencyBRL(value){
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency:"BRL",
  })

  return value
}

//Captura o evento de submit do formulário.
form.onsubmit = (event)=> {
  event.preventDefault()

  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id:category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  }
  expenseAdd(newExpense)
}

//Adiciona um novo item na lista.(ul com informações do input)
function expenseAdd(newExpense) {
  try {
    //cria o elemento para adicionar na lista.
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

    //Cria o item da categoria.
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)
  

    //cria a info da despesa
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    //Cria o nome da despesa
    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense

    //cria a categoria da despesa
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    //Adiciona nome e categoria na div nas informações da desesa.
    expenseInfo.append(expenseName, expenseCategory)

    //Cria o valor da despesa.
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase()
    .replace("R$", "")
    }`

    //Cria o icone de remover
    const removeIcon = document.createElement("img")
    removeIcon.setAttribute("src", "/img/remove.svg")
    removeIcon.setAttribute("alt", "Remover")
    removeIcon.classList.add("remove-icon")

    //Adiciona as informações no item.
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

    // Adiciona o item na lista.
    expenseList.append(expenseItem)

    //Limpa o formulário
    formClear()
  
    //Atualiza os totais.
    updateTotals()


  } catch (error) {
    alert("Não foi possível atualizar a lista de despesas.")
    console.log(error)
  }
}

//atualizar os totais
function updateTotals(){
  try {
    //Recupera todos os itens(li) da lista
    const items = expenseList.children
    
    //Atualiza a quantidade de items da lista.
    expenseQuatity.textContent = `${items.length} ${
      items.length > 1 ? "despesas" : "despesa"
    }`

    //Variável para incrementar o total.
    let total = 0

    //Percorre cada item (li) da lista (ul)
    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount")

      //Remove caracteres não numéricos e substitui a vírgula por ponto
      let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")

      //Convert o valor para float.
      value = parseFloat(value)

      //Verifica se é um número válido.
      if(isNaN(value)) {
        return alert(
          "Não foi possível calcular o total. O valor não parece ser um número"
        )
      }

      //Incrementa o valor total.
      total += Number(value)
    }

    //Cria a span para adicionar o R$ formatado
    const symbolBRL = document.createElement("small")
    symbolBRL.textContent = "R$"

    //Formata o valor e remove o R# que será exibido pela small com um estilo customizado.
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")
    
    //Limpa o contepudo do elemento.
    expensesTotal.innerHTML = ""

    //adiciona o simbolo 
    expensesTotal.append(symbolBRL,total)

  } catch (error) {
    console.log(error)
    alert("Não foi possível atualizar os totais")
  }
}

//Evento que captura o clique nos itens da lista.
expenseList.addEventListener("click" , function (event){
  //Verifica se o elemento clicado é o ícone de remover.
  if(event.target.classList.contains("remove-icon")){
    //Obtém a li pai do elemento clicado.
    const item = event.target.closest(".expense")
    item.remove()
  }
  updateTotals()
})

function formClear(){
  expense.value = ""
  category.value = ""
  amount.value = "" 

  expense.focus()
}