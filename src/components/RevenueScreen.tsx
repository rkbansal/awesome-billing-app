const RevenueScreen = () => {
  return (
    <div>
      <h2>Daily Revenue: Rs.{500}</h2>
      <ul>
        {[].map((sale: any, index: number) => (
          <li key={index}>
            Customer: {sale.customerId}, Total: ${sale.totalAmount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RevenueScreen;
