const monto = document.getElementById("monto");
const moneda = document.getElementById("moneda");
const resultado = document.getElementById("resultado");
const consultar = document.getElementById("consultar");
let graficoActual = null;

consultar.addEventListener("click", async () => {
  const montoValue = monto.value;
  const monedaValue = moneda.value;

  if (!monedaValue || monedaValue === "Seleccione moneda" || !montoValue) {
    resultado.innerHTML = "La moneda y el monto son obligaroios";
    resultado.style.color = 'red';
    return;
  }

  if (montoValue <= 0) {
    resultado.innerHTML = "El monto debe ser mayor a 0";
    resultado.style.color = 'red';
    return;
  }

  const api = await obtenerMoneda(monedaValue);
  renderGrafica(api.serie.slice(0, 10));
  const tipoCambio = api.serie[0].valor;
  const total = montoValue / tipoCambio;

  resultado.innerHTML = `Resultado: $${total.toFixed(2)}`;
  resultado.style.color = '#fff';

});

const obtenerMoneda = async (moneda) => {
  try {
    const api = await fetch(`https://mindicador.cl/api/${moneda}`);
    resultados = await api.json();
    return resultados;
  } catch {
    resultado.innerHTML = "Error al obtener la conversión";
    resultado.style.color = 'red';
  }
};

const getAndCreateDataToChart = async (listado) => {
  const labels = listado.map((valores) => {
    return convertirFecha(valores.fecha);
  });
  const data = listado.map((valores) => {
    const valor = valores.valor;
    return valor;
  });
  const datasets = [
    {
      label: `Historial últimos 10 días - Tipo de cambio para ${moneda.value}`,
      borderColor: "rgb(255, 99, 132)",
      data,
    },
  ];
  return { labels, datasets };
};

const renderGrafica = async (listado) => {
  const data = await getAndCreateDataToChart(listado);
  const config = {
    type: "line",
    data,
  };

  const myChart = document.getElementById("myChart");
  myChart.style.backgroundColor = "#212529";
  if (graficoActual) {
    graficoActual.destroy();
  }
  graficoActual = new Chart(myChart, config);
};

const convertirFecha = (fechaOriginal) => {
  const fecha = new Date(fechaOriginal);

  const dia = String(fecha.getUTCDate()).padStart(2, "0");
  const mes = String(fecha.getUTCMonth() + 1).padStart(2, "0");
  const anio = fecha.getUTCFullYear();

  const fechaInvertida = `${dia}/${mes}/${anio}`;

  return fechaInvertida;
};

const agregarComboBox = () => {
  const monedas = [
    { valor: "dolar", nombre: "Dolar" },
    { valor: "euro", nombre: "Euro" },
    { valor: "bitcoin", nombre: "Bitcoin" },
  ];
  monedas.forEach((opcion) => {
    const nevaOpcion = new Option(opcion.nombre, opcion.valor);
    moneda.append(nevaOpcion);
  });
};

agregarComboBox();
