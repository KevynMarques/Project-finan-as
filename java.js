const layers = {
  open() {
    document.querySelector('.layersinternal').classList.add('active')
  },
  close() {
    document.querySelector('.layersinternal').classList.remove('active')
  }
}

const Transaction = [
  {
    description: 'Luz',
    amount: -5000,
    date: '21/01/2021'
  },

  {
    description: 'WebSite',
    amount: 500000,
    date: '23/01/2021'
  },

  {
    description: 'Internet',
    amount: -20000,
    date: '22/01/2021'
  },
  {
    description: 'APP',
    amount: 20000,
    date: '22/01/2021'
  }
]

const Result = {
  all: Transaction,

  add(Transaction) {
    Result.all.push(Transaction)

    App.reload()
  },

  remove(index) {
    Result.all.splice(index, 2)
    App.reload()
  },

  Appetizer() {
    let Appetizer = 0

    Transaction.forEach(Transaction => {
      if (Transaction.amount > 0) {
        Appetizer += Transaction.amount
      }
    })

    return Appetizer
  },

  Exit() {
    let Exit = 0

    Transaction.forEach(Transaction => {
      if (Transaction.amount < 0) {
        Exit += Transaction.amount
      }
    })

    return Exit
  },

  Total() {
    return Result.Appetizer() + Result.Exit()
  }
}
const DOM = {
  transactionsContainer: document.querySelector('#transaction-table tbody'),

  addTransaction(Transaction, index) {
    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLTransaction(Transaction, index)
    tr.dataset.index = index

    DOM.transactionsContainer.appendChild(tr)
  },

  innerHTMLTransaction(Transaction, index) {
    const CSSclass = Transaction.amount > 0 ? 'prohibited' : 'exit'
    const amount = Utils.formatCurrency(Transaction.amount)

    const html = ` 
              <td class="Start">${Transaction.description}</td>
              <td class="${CSSclass}">${amount}</td>
              <td class="theend">${Transaction.date}
                <img onclick"Transaction.remove(${index})" src="/assets/minus.svg" alt="" />
              </td> `
    return html
  },

  updateBalance() {
    document.getElementById('Entrada').innerHTML = Utils.formatCurrency(
      Result.Appetizer()
    )

    document.getElementById('Saida').innerHTML = Utils.formatCurrency(
      Result.Exit()
    )

    document.getElementById('Total').innerHTML = Utils.formatCurrency(
      Result.Total()
    )
  },

  ClearTransactions() {
    DOM.transactionsContainer.innerHTML = ''
  }
}

const Utils = {
  formatAmount(value) {
    value = Number(value) * 100
    return value
  },
  formatDate(date) {
    const splittedDate = date.split('-')
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  },

  formatCurrency(value) {
    const signal = Number(value) < 0 ? '-' : ''

    value = String(value).replace(/\D/g, '')
    value = Number(value) / 100
    value = value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })

    return signal + value
  }
}

const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },

  validateFields() {
    const { description, amount, date } = Form.getValues()

    if (
      description.trim() === '' ||
      amount.trim() === '' ||
      date.trim() === ''
    ) {
      throw new Error('Por favor, preencha todos os campos')
    }
  },

  formatValues() {
    let { description, amount, date } = Form.getValues()

    amount = Utils.formatAmount(amount)

    date = Utils.formatDate(date)

    return {
      description,
      amount,
      date
    }
  },

  clearFields() {
    Form.description.value = ""
    Form.amount.value =""
    Form.date.value = ""
  },

  submit(event) {
    event.preventDefault()

    try {
      Form.validateFields()
      const transaction = Form.formatValues()
      Result.add(transaction)
      Form.clearFields()
      layers.close()
      
    } catch (error) {
      alert(error.message)
    }
  }
}

const Storage = {
  get() {
      return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
  },

  set(transactions) {
      localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
  }
}

const App = {
  init() {
    Result.all.forEach(DOM.addTransaction)
    DOM.updateBalance()
  },

  reload() {
    DOM.ClearTransactions()
    App.init()
  },
}

App.init()
