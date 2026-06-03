import './styles/HomeStyles.css'
import logo from './assets/logo-Qard.png'

function App() {
  return (
    <>
      <header className="header">
        <div className="header-left">
          <img src={logo} alt="logo" width="50" height="50" />
          <h1>QARD</h1>
        </div>
        <div className="header-right">
          <a href="">Gonzalo Silvero</a>
        </div>
      </header>

      {/* Barra lateral de navegacion */}
      <nav className="nav">
        <div className="icon"></div>
        <div className="icon"></div>
        <div className="icon"></div>
        <div className="icon"></div>
      </nav>

      <main className="main">
        {/* Lado izquierdo - transacciones */}
        <section className="left-section">
          {/* Titulo */}
          <header>
            <h2>TRANSACCIONES</h2>
          </header>
          {/* Tabla */}
          <article>
            {/* color */}
            <div></div>
            {/* descripcion */}
            <span className="desc">egreso</span>
            {/* monto */}
            <span className="amount">$1.00000000000</span>
            {/* fecha */}
            <span className="date">00/00</span>
          </article>
        </section>

        {/* Lado derecho - formularios */}
        <section className="right-section">

          <form>
            <div>
              NUEVO INGRESO
              <div>+ ingreso</div>
            </div>

            Descripcion
            <input type="text" />
            Monto
            <input type="text" />

            <button>Agregar</button>
          </form>

          <form>
            <div>
              NUEVO EGRESO
              <div>- egreso</div>
            </div>

            Descripcion
            <input type="text" />
            Monto
            <input type="text" />

            <button>Agregar</button>
          </form>

        </section>
      </main>

      <footer className="footer">
        <small>&copy; 2023 Qard</small>
        <a>Instagram</a>
        <a>Github</a>
        <a>Linkedin</a>
        <a>Contacto</a>
      </footer>
    </>
  )
}

export default App;