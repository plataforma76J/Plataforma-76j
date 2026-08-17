const express = require('express');
const { MercadoPagoConfig, Payment } = require('mercadopago');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const client = new MercadoPagoConfig({ 
    accessToken: 'APP_USR-8439953090357009-081622-342313dca11a18fa3ce6e1b912edf8be-566020729'
});
const payment = new Payment(client);

app.post('/criar-pix', async (req, res) => {
    try {
        const body = {
            transaction_amount: 10.00,
            description: 'Depósito Plataforma 76J',
            payment_method_id: 'pix',
            payer: {
                email: req.body.email || 'cliente@email.com',
                first_name: req.body.nome || 'Cliente',
            },
        };

        const response = await payment.create({ body });

        res.json({
            id: response.id,
            status: response.status,
            qr_code: response.point_of_interaction.transaction_data.qr_code,
            qr_code_base64: response.point_of_interaction.transaction_data.qr_code_base64
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
