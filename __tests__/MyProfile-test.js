import { render } from 'react-native-testing-library';
// import { render } from "react-testing-library";
import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Provider } from "mobx-react";
// import MyProfileTest from "../App/Components/Profile/Screen/MyProfile";
import MyProfileTest from "../App/Components/Profile/Screen/MyProfileTest";
import { LoggedInUser } from "../__mocks__/helpers/users";

// jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));  //c.f. https://github.com/software-mansion/react-native-reanimated/issues/650
// jest.mock('react-native-gesture-handler', () => { return {} })  //c.f. https://github.com/software-mansion/react-native-gesture-handler/issues/344
// jest.mock('reanimated-bottom-sheet', () => { return {} })
// const fakeAxios = {
//   get: jest.fn(() => Promise.resolve({data: {greeting: 'hello there'}})),
// }

// "instaUserName": "exam_trick",
let loggedInUser = LoggedInUser;
let posts = [];
let isLoading = false;
const mockMyProfileStore = {
  isLoading,
  posts,
  ...loggedInUser
};
const mockAuthStore = {
  isLoading,
  setNavigation: () => {}
};

const createTestProps = (props: Object) => ({
  navigation: {
    setOptions: () => {},
    navigate: () => {},
    addListener: () => {}
  },
  ...props
});
let props = createTestProps({});

describe("rendering", () => {
  let bio;
  beforeEach(() => {
    const { getByTestId } = render(<MyProfileTest {...props} MyProfileStore={mockMyProfileStore} AuthStore={mockAuthStore} />);
    bio = getByTestId("bio");
  })

  it("should render a bio <Text/>", () => {
    expect(bio).not.toBe(null);
  });

  it("should contain a child text", () => {
    console.log(typeof bio)
    console.log(Object.values(bio))
    console.log(Object.values(bio)[1] && Object.values(bio)[1].children)
    let bioText = (Object.values(bio)[1] && Object.values(bio)[1].children) || (bio.children && bio.children[0])
    expect(bioText).toBe('I am Shaikh');
  });
});
