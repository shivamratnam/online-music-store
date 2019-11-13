exports.home_page = (req, res) => {
    res.render('home/home-page', {
        title: 'Music Store'
    });
}
exports.product_details = (req, res) => {
    res.render('home/item-details', {
        title: 'Product Details'
    });
}