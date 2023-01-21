function formatPrice(price) {
    // Create our number formatter.
    const formatter = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
    });
    return formatter.format(price)
}
