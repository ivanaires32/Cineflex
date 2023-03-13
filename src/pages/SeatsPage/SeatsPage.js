import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"

const ocupados = []
export default function SeatsPage({ name, setName, cpf, setCpf, dia, setDia, horario, setHorario, disponivel, setDisponivel }) {
    const [sessao, setSessao] = useState([])
    const [lugares, setLugares] = useState([])
    const [jaEscolido, setJaEscolido] = useState([])
    const [reservar, setReservar] = useState([])
    const { idSessao } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const url = `https://mock-api.driven.com.br/api/v8/cineflex/showtimes/${idSessao}/seats`

        const promise = axios.get(url)

        promise.then((res) => {
            setSessao(res.data.movie)
            setDia(res.data.day)
            setHorario(res.data.name)
            setLugares(res.data.seats)
        })
        promise.catch(res => console.log(res.response.data))
    }, [])

    function reservarAssentos(e) {
        e.preventDefault()
        const url_post = "https://mock-api.driven.com.br/api/v8/cineflex/seats/book-many"
        const dados = {
            ids: reservar,
            name: name,
            cpf: cpf
        }
        const promise = axios.post(url_post, dados)

        promise.then(() => navigate("/finalizar"))
        promise.catch(err => console.log(err))
    }

    return (
        <PageContainer>
            Selecione o(s) assento(s)

            <SeatsContainer>
                {lugares.map((e, i) => (
                    <SeatItem data-test="seat" key={e.id} ocupado={e.isAvailable === false ? ocupados.push(e) : ""}
                        selecionado={!ocupados.includes(e) ? "lightblue" : "#FBE192"}
                        selecionei={disponivel.includes(i) ? "#1AAE9E" : ""}
                        onClick={() => selecionar(e, ocupados, i, disponivel, setDisponivel, setJaEscolido, e.id, setReservar, reservar)}>{e.name}</SeatItem>
                ))}

            </SeatsContainer>

            <CaptionContainer>
                <CaptionItem>
                    <CaptionCircle cor={'#1AAE9E'} />
                    Selecionado
                </CaptionItem>
                <CaptionItem>
                    <CaptionCircle cor={"lightblue"} />
                    Disponível
                </CaptionItem>
                <CaptionItem>
                    <CaptionCircle cor={"#FBE192"} />
                    Indisponível
                </CaptionItem>
            </CaptionContainer>

            <FormContainer onSubmit={reservarAssentos}>
                <label htmlFor="name">Nome do Comprador:</label>
                <input data-test="client-name" onChange={e => setName(e.target.value)} value={name} id="name" required placeholder="Digite seu nome..." />

                <label htmlFor="cpf">CPF do Comprador:</label>
                <input data-test="client-cpf" onChange={e => setCpf(e.target.value)} value={cpf} id="cpf" required placeholder="Digite seu CPF..." />

                <button data-test="book-seat-btn" type="Submit">Reservar Assento(s)</button>

            </FormContainer>

            <FooterContainer data-test="footer">
                <div>
                    <img src={sessao.posterURL} alt="poster" />
                </div>
                <div>
                    <p>{sessao.title}</p>
                    <p>{`${dia.weekday} - ${horario}`}</p>
                </div>
            </FooterContainer>

        </PageContainer>
    )
}

function selecionar(e, ocupados, indice, disponivel, setDisponivel, setJaEscolido, elemento, setReservar, reservar) {
    if (ocupados.includes(e)) {
        return alert("Esse assento não está disponível")
    }

    else if (disponivel.includes(indice)) {

        let aux = disponivel.indexOf(indice)
        let aux2 = reservar.indexOf(elemento)

        while (aux >= 0) {
            setJaEscolido(disponivel.splice(aux, 1))
            setReservar(reservar.splice(aux2, 1))

            aux = disponivel.indexOf(indice)
            aux2 = reservar.indexOf(elemento)
        }
    }
    else if (e.isAvailable === true) {
        setDisponivel([...disponivel, indice])
        setReservar([...reservar, elemento])
    }
}


const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Roboto';
    font-size: 24px;
    text-align: center;
    color: #293845;
    margin-top: 30px;
    padding-bottom: 120px;
    padding-top: 70px;
`
const SeatsContainer = styled.div`
    width: 330px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
`
const FormContainer = styled.form`
    width: calc(100vw - 40px); 
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 20px 0;
    font-size: 18px;
    input {
        width: calc(100vw - 60px);
    }
    input [type=Submit]{
        background-color: red;
        width: 300px;
    }
`
const CaptionContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 300px;
    justify-content: space-between;
    margin: 20px;
`
const CaptionCircle = styled.div`
    border: 1px solid blue;         // Essa cor deve mudar
    background-color: ${props => props.cor};    // Essa cor deve mudar
    height: 25px;
    width: 25px;
    border-radius: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 3px;
    
`
const CaptionItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
`
const SeatItem = styled.div`
    border:  1px solid blue;         // Essa cor deve mudar
    background-color: ${props => props.selecionado};    // Essa cor deve mudar
    background-color: ${props => props.selecionei};
    height: 25px;
    width: 25px;
    border-radius: 25px;
    font-family: 'Roboto';
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 3px;
`
const FooterContainer = styled.div`
    width: 100%;
    height: 120px;
    background-color: #C3CFD9;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 20px;
    position: fixed;
    bottom: 0;

    div:nth-child(1) {
        box-shadow: 0px 2px 4px 2px #0000001A;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
        margin: 12px;
        img {
            width: 50px;
            height: 70px;
            padding: 8px;
        }
    }

    div:nth-child(2) {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        p {
            text-align: left;
            &:nth-child(2) {
                margin-top: 10px;
            }
        }
    }
`