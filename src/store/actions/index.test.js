import moxios from "moxios" 
import { testStore } from "../../components/reusables/resuableFunctions"
import { fetchUsers,  fetchComments} from "./index.js"

describe("fetchUsers action", () => {

    beforeEach(() => {
        moxios.install() // install so when we hit axios it doesn't go to the internet and instead tests our expectedState variable
    })

    afterEach(() => {
        moxios.uninstall()
    })

    test("usersArray store is updated correctly", () => {

        const expectedState = [{
            title: "Example title 1",
            body: "Some text"  },
        {
            title: "Example title 2",
            body: "Some text"  },
          {
            title: "Example title 3",
            body: "Some text"  }]

          const store = testStore()

          moxios.wait(() => { //after installing moxios, look at our most recent request and respond with success and our expected state
              const request = moxios.requests.mostRecent();
              request.respondWith({
                  status: 200,
                  response: expectedState
              })
          })

          return store.dispatch(fetchUsers())//use fetchUsers handler to see if it updates the the store correctly
          .then(() => {
              const newState = store.getState();
              expect(newState.usersArray).toBe(expectedState)
          })

    })

    test("postComments store is updated correctly", () => {

        const expectedState = [{
            title: "Example title 1",
            body: "Some text"  },
        {
            title: "Example title 2",
            body: "Some text"  },
          {
            title: "Example title 3",
            body: "Some text"  }]

          const store = testStore()

          moxios.wait(() => {
              const request = moxios.requests.mostRecent();
              request.respondWith({
                  status: 200,
                  response: expectedState
              })
          })

          return store.dispatch(fetchComments())
          .then(() => {
              const newState = store.getState();
              expect(newState.postComments).toBe(expectedState)
          })

    })

})
