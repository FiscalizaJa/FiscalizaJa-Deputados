import "../styles/deputados/despesas.scss";

export default function Despesas(props: { children }) {
    return (
        <div className="despesas">
            {props.children}
        </div>
    )
}