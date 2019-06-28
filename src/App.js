import React, {Component} from 'react';
// import logo from './logo.svg';
import './App.css';
import { HashRouter, BrowserRouter as Router, Route, NavLink, Switch, Redirect } from 'react-router-dom'

class App extends Component {
  constructor () {
    super()
    // 数据
    this.state = {
      newContent: '',
      todo: [
        {id:1, isCompleted:true, content: '吃饭'},
        {id:2, isCompleted:false, content: '睡觉'},
        {id:3, isCompleted:true, content: '打豆豆'}
      ],
      editindId: -1,
      num: 0,
      allChecked: false,
      showClean: false,
      filter: '#/'
    }
  }
  // 计算剩余数
  count () {
    let num =0
    let checkboxAii = true
    this.state.showClean = false
    this.state.todo.forEach(item => {
      if (!item.isCompleted) {
        num++
        // 判断是否权限
        // 有一个没有选择则全选不亮
        checkboxAii = false
      } else {
        this.state.showClean = true
      }
    })
    this.setState({
      num: num,
      allChecked: checkboxAii
    })
  }
  // 发请求组件初始化
  componentDidMount () {
    this.count()
    this.state.filter = window.location.hash
    window.addEventListener('hashchange', ()=> {
      this.setState({
        filter: window.location.hash
      })
    })   
  }
  // 渲染数据
  readerList () {
    let {todo, filter} = this.state
    // 此处判断filter是那个路由就过滤掉那些item
    // filter是/active 过滤掉isCompleted：true
    // filter是/completed过滤掉isCompleted：false
    return todo.map(item => {
      if (filter === '#/active' && item.isCompleted) {
        return null
      }
      if (filter === '#/completed' && !item.isCompleted) {
        return null
      }
      return (
        // className="completed"
        <li key={item.id} className={ (item.isCompleted?'completed ':'') + (this.state.editindId === item.id ? 'editing' : '')}>
          <div className="view">
            <input className="toggle" type="checkbox" checked={item.isCompleted} onChange={e => this.isCompleted(e, item)}/>
            <label onDoubleClick={e => {this.doubleClick(item)}}>{item.content}</label>
            <button className="destroy" onClick={e => this.deleteTodo(item)}></button>
          </div>
          <form onSubmit={e => this.endEdit(e)}>
            <input ref={'todo_'+ item.id} className="edit" value={item.content}
              onChange={e => this.saveEdit(e, item)}
              onBlur={e => this.endEdit(e)}/>
          </form>
        </li>
      )
    })
  }
  // 输入方法
  valAddChang (e) {
    this.setState({
      newContent: e.target.value
    })
  }
  // 添加方法
  addTodo (e) {
    e.preventDefault()
    if (this.state.newContent.trim()) {
      let maxId = -1
      this.state.todo.forEach(item => {
        if (item.id > maxId) {
          maxId = item.id
        }
      })
      maxId ++
      this.state.todo.push({
        id:maxId,
        isCompleted: false,
        content: this.state.newContent 
      })
      this.setState({newContent: ''})
      this.count()
    }
  }
  // 删除方法
  deleteTodo (todo){
    let todos = this.state.todo
    let index = todos.findIndex( t => t.id === todo.id )
    todos.splice(index, 1)
    this.setState({})
    this.count()
  }
  // 选择事件
  isCompleted (e, item) {
    item.isCompleted = e.target.checked
    this.setState({})
    this.count()
  }
  // 双击修改
  doubleClick (item) {
    this.setState({
      editindId: item.id
    }, ()=> {
      // 编辑框获取焦点
      this.refs['todo_'+item.id].focus()
    })
  }
  // 保存编辑
  saveEdit (e, item) {
    item.content = e.target.value
    this.setState({})
  }
  // 编辑回车事假
  endEdit (e) {
    e.preventDefault()
    this.setState({
      editindId: -1
    })
  }
  // 全选全不选
  allCheckbox (e) {
    this.state.todo.forEach(item => {
      item.isCompleted = e.target.checked
    })
    this.setState({
      allChecked: e.target.checked
    })
    this.count()
  }
  // 删除已完成
  clearFun (e) {
    let {todo} = this.state
    for (let i = todo.length-1; i >= 0; i--) {
      if (todo[i].isCompleted) {
        todo.splice(i, 1)
      }
    }
    this.count()
  }
  // 过滤显示
  filterRender (e) {
    let hash = e.target.hash
    this.setState({
      filter: hash
    })
  }
  render () {
    return (
      <React.Fragment>
        <section className="todoapp">
          <header className="header">
            <h1>todos</h1>
            <form onSubmit={e => this.addTodo(e)}>
              <input className="new-todo" placeholder="What needs to be done?" autoFocus value={this.state.newContent}
                onChange={e => this.valAddChang(e)} onBlur={e => this.addTodo(e)}/>
            </form>
          </header>
          <section className="main">
            <input id="toggle-all" className="toggle-all" type="checkbox" onChange={e => this.allCheckbox(e)} checked={this.state.allChecked}/>
            <label htmlFor="toggle-all">Mark all as complete</label>
            <ul className="todo-list">
              {this.readerList()}
              {/* <li className="completed">
                <div className="view">
                  <input className="toggle" type="checkbox" checked/>
                  <label>Taste JavaScript</label>
                  <button className="destroy"></button>
                </div>
                <input className="edit" value="Create a TodoMVC template"/>
              </li> */}
            </ul>
          </section>
          <footer className="footer">
            <span className="todo-count"><strong>{this.state.num}</strong> item left</span>
            <ul className="filters">
              <li>
                <a className="selected" href="#/" onClick={e => this.filterRender(e)}>All</a>
              </li>
              <li>
                <a href="#/active" onClick={e => this.filterRender(e)}>Active</a>
              </li>
              <li>
                <a href="#/completed" onClick={e => this.filterRender(e)}>Completed</a>
              </li>
            </ul>
            {this.state.showClean ? <button className="clear-completed" onClick={e => this.clearFun(e)}>Clear completed</button> : ''}
          </footer>
        </section>
        <footer className="info">
          <p>Double-click to edit a todo</p>
          <p>Template by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>
          <p>Created by <a href="http://todomvc.com">you</a></p>
          <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
        </footer>
        <script src="node_modules/todomvc-common/base.js"></script>
        <script src="js/app.js"></script>
      </React.Fragment>
    );
  }
  
}

export default App;
