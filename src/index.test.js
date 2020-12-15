import test from "tape"
import { createStore, combineReducers } from "redux"

import { buildList } from "."

test("List without API methods", async t => {
  // WHAT TO TEST
  const todos = buildList({
    name: "TODOS",
  })

  // Redux store
  const store = createStore(
    combineReducers({
      [todos.name]: todos.reducer,
    })
  )

  t.equals(todos.name, "TODOS", "New list created with unique name")

  t.throws(
    () => {
      buildList({ name: "TODOS" })
    },
    /JustAList: List with name "TODOS" already exists/,
    "Throw exception when creating a list with a duplicate name"
  )

  t.throws(
    () => {
      buildList()
    },
    /JustAList: "name" property is required, received "undefined"/,
    "Throw exception when creating a list without any params"
  )

  todos.set({ dispatch: store.dispatch })

  const { items, is, logs } = todos.selector(store.getState())

  t.deepEquals(
    {
      items: items(),
      itemsCreating: items({ status: "creating" }),
      itemsUpdating: items({ status: "updating" }),
      itemsRemoving: items({ status: "removing" }),

      isLoaded: logs({ type: "read" }).length > 0,

      isCreating: is({ status: "creating" }),
      isReading: is({ status: "reading" }),
      isUpdating: is({ status: "updating" }),
      isRemoving: is({ status: "removing" }),
    },
    {
      items: [],
      itemsUpdating: [],
      itemsRemoving: [],
      itemsCreating: [],

      isLoading: false,
      isLoaded: false,
      isCreating: false,
      isUpdating: false,
      isRemoving: false,
    },
    "Default state initialized in redux store via list selector"
  )

  t.throws(
    () => {
      todos.create({ id: 2 })
    },
    /JustAList: "TODOS"."create" must be a function, got "undefined"/,
    'Throw exception when calling "create" on list without methods'
  )

  t.throws(
    () => {
      todos.read()
    },
    /JustAList: "TODOS"."read" must be a function, got "undefined"/,
    'Throw exception when calling "read" on list without methods'
  )

  t.throws(
    () => {
      todos.readOne()
    },
    /JustAList: "TODOS"."readOne" must be a function, got "undefined"/,
    'Throw exception when calling "readOne" on list without methods'
  )

  t.throws(
    () => {
      todos.update(1, { test: 2 })
    },
    /JustAList: "TODOS"."update" must be a function, got "undefined"/,
    'Throw exception when calling "update" on list without methods'
  )

  t.throws(
    () => {
      todos.remove(1, { test: 2 })
    },
    /JustAList: "TODOS"."remove" must be a function, got "undefined"/,
    'Throw exception when calling "remove" on list without methods'
  )

  await todos.clear()

  t.deepEquals(
    todos.selector(store.getState()).items(),
    [],
    "Builtin .clear should remove all items from state"
  )

  t.end()
})
