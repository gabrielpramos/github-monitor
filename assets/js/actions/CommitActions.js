import * as types from './ActionTypes';

export const createRepositorySuccess = (response, successMessage) => ({
  type: types.CREATE_REPOSITORY_SUCCESS,
  payload: { response, successMessage },
});

export const getCommitsSuccess = commits => ({
  type: types.GET_COMMITS_SUCCESS,
  payload: commits,
});

export const createCommitsListSuccess = (response, succesMessage) => ({
  type: types.CREATE_COMMITS_LIST,
  payload: { response, succesMessage }
})
