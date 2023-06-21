import React, { Fragment, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { getRepositories } from '../api/CommitAPI';
import { AppContext } from '../router';
import { RepoCreateContainerContext } from '../containers/RepoCreateContainer';

const validateForm = (repositoryName, username) => {
  return repositoryName && repositoryName.startsWith(`${username}/`);
};

const validateRepository = (repository = '', repositoryList) => {
  const [, name] = repository.split('/');
  return !repositoryList.some(({ name: localrepositoryName }) => localrepositoryName.toLowerCase().includes(name.toLowerCase()));
}

const RepoCreateForm = (props) => {
  const {
    change,
    successMessage, handleSubmit, submitting,
  } = props;
  const { username } = useContext(AppContext);
  const { localRepositories } = useContext(RepoCreateContainerContext);
  const [submitted, setSubmitted] = useState(false);
  const [repositoryName, setRepository] = useState('');
  const [repositoryList, setRepositoryList] = useState([]);
  const [showList, setShowList] = useState(false);
  const [formValidation, setFormValidation] = useState(true);
  const [showRepositoryError, setShowRepositoryError] = useState(false);

  const repositoryNameAttribute = 'repositoryName';
  const errorMessage = `Repository must belong to you (eg: ${username}/repo-name)`;

  const { data } = getRepositories();

  const filterName = (name, filterKey) => (filterKey === '' || name.includes(filterKey) || `${username}/${name}`.includes(filterKey));
  const filterList = (list, filterKey) => {
    const filterKeyLower = filterKey.toLowerCase();
    return list.filter(({ name }) => {
      const nameLower = name.toLowerCase();

      return filterName(nameLower, filterKeyLower)
    });
  }

  const filteredList = filterList(repositoryList, repositoryName).filter(({ name }) => !localRepositories.some(({ name: localrepositoryName }) => name.toLowerCase() === localrepositoryName.toLowerCase()));
  const filteredLocalList = filterList(localRepositories, repositoryName);


  useEffect(() => {
    if (data && data.length > 0) {
      setRepositoryList(data);
    }
  }, [data]);

  const onChange = (value) => {
    change(repositoryNameAttribute, value);
    setRepository(value);

    setFormValidation(validateForm(value, username));
  }

  const onSubmit = (event) => {
    const validRepositoryName = validateRepository(repositoryName, localRepositories);

    if (formValidation && validRepositoryName) {
      handleSubmit(event);
      setSubmitted(true);
    } else if (!validRepositoryName) {
      setShowRepositoryError(!validRepositoryName);

      event.preventDefault();
    }
  }

  useEffect(() => {
    if (submitted) {
      onChange('');
      setSubmitted(false);
    }
  }, [submitted]);

  const inputComponent = () => <Fragment />

  return (
    <div>
      {successMessage
        && (
          <div className="alert alert-success" role="alert">
            Repository added successfully!
          </div>
        )}
      {showRepositoryError
        && (
          <div className="alert alert-danger" role="alert">
            The repository you have inputed, has already been submitted.

            <br />

            Please try to submit a different repository.

            <br />

            Unique repository rule.
          </div>
        )}
      <form onSubmit={onSubmit}>
        <div className="form-row">
          <div className="col-10">
            <div className='redux-input'>
              <Field
                placeholder="Enter the repository name, must match {user}/{repo}"
                component={inputComponent}
                name={repositoryNameAttribute}
              />
            </div>

            <input
              autoComplete="false"
              placeholder="Enter the repository name, must match {user}/{repo}"
              className="form-control"
              type="text"
              value={repositoryName}
              onFocus={() => {
                setShowList(true);
              }}
              onChange={({ target }) => { onChange(target.value); }}
            />

            {!formValidation
              &&
              <div className="text-danger error-message">
                {errorMessage}
              </div>
            }
          </div>

          {showList &&
            <div className='repositories-list'>
              {!formValidation
                &&
                <div className="text-danger error-message">
                  {errorMessage}
                </div>
              }

              <button type="button" className='close-button'
                onClick={() => {
                  setShowList(false);
                }}>X</button>

              {
                filteredList.length > 0 || filteredLocalList.length > 0 ?
                  <ul>
                    {filteredList.length > 0 &&
                      <Fragment>
                        <p className='repo-list-label'>
                          Available Repositories:
                        </p>

                        {
                          filteredList.map(({ name }) => (
                            <li className='repo-item' key={name} onClick={() => {
                              onChange(`${username}/${name}`);
                              setShowList(false);
                            }}>
                              {name}
                            </li>
                          ))
                        }
                      </Fragment>
                    }

                    {
                      filteredLocalList.length > 0 ?
                        (
                          <Fragment>
                            <hr />
                            <p className='selected repo-list-label'>
                              Submitted:
                            </p>
                            {
                              filteredLocalList.map(({ name }) => (
                                <li className='repo-item selected' key={name} disabled>{name}</li>
                              ))
                            }
                          </Fragment>
                        )
                        :
                        (<Fragment></Fragment>)
                    }

                  </ul>
                  :
                  <p className='no-repo-found'>No repository found.</p>
              }
            </div>
          }

          <div className="col-2">
            <button disabled={repositoryName.trim().length === 0 || submitting} className="btn btn-block btn-primary" type="submit">
              Submit
            </button>
          </div>
        </div>
      </form >
    </div >
  );
};

RepoCreateForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  successMessage: PropTypes.bool.isRequired,
};

export default reduxForm({
  form: 'repoCreate',
})(RepoCreateForm);
