import React, { Component } from "react";
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import Container from '../../components/Container'
import { Form, SubmitButton, List} from './styles';

export default class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
    //criar a variável Error (desafio 5)
    error: false
  };

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value });
  };

  //Carregar os dados localStorage
  componentDidMount() {
    const repositories = localStorage.getItem('repositories')

    if(repositories) {
      this.setState({ repositories: JSON.parse(repositories) })
    }
  }

  // Salvar os dados do localStorage
  componentDidUpdate(_, prevState) {

    const { repositories } = this.state;

    if(prevState.repositories !== this.state.repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories))
    }
  }

  handleSubmit = async e => {
    e.preventDefault();

    //chamar a variável Error no handleSubmit

    this.setState({ loading: true, error: false })

    try {

      const { newRepo, repositories } = this.state;

      const findRepo = repositories.find(repo => repo.name === newRepo)

      if(findRepo) {
        throw new Error('Repositório duplicado');
      }
      const response = await api.get(`/repos/${newRepo}`);

      const data = {

      name: response.data.full_name,
    }

    this.setState({
      repositories: [...repositories, data],
      newRepo:'',
      loading: false,
    });

    } catch (error) {
      this.setState({ error: true });
    }finally {
      this.setState({ loading: false });
    }

  }

  render() {
    const { newRepo, repositories, loading, error } = this.state;
    return (
      <Container>
        <h1>
          <FaGithubAlt/>
          Repositórios
        </h1>

        <Form onSubmit={this.handleSubmit} error={error ? 1 : 0} >
          <input
            type="text"
            placeholder="Adicionar Repositório"
            value={newRepo}
            onChange={this.handleInputChange}

          />

          <SubmitButton loading={loading} error={error ? 1 : 0}>
            { loading ? (<FaSpinner color="FFF" size={14} />) : (<FaPlus color="#FFF" size={14} />) }

          </SubmitButton>
        </Form>

        <List>
          { repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}><button>Detalhes</button></Link>
            </li>
          )) }
        </List>
      </Container>
    )
  }
}
