import CardTransaction from "../components/CardTransaction";

export default function TransactionsPage() {
  return (
    <>
      <section className="left-section">
        <header>
          <h2>TRANSACCIONES</h2>
        </header>
        {/* acá va el contenido izquierdo */}
      </section>

      <section className="right-section">
        {/* acá va el contenido derecho */}
        <CardTransaction />
      </section>
    </>
  )
}
