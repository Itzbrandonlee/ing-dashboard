import GetOrderDetails from '../../components/GetOrderDetails';

interface OrderDetailsPageProps {
  params: {
    order_id: string;
  };
}

const OrderDetailsPage = ({ params }: OrderDetailsPageProps) => {
  const { order_id } = params;

  return <div className="bg-slate-50 text-black flex min-h-screen flex-col items-center justify-between p-24"><GetOrderDetails order_id={order_id} /></div>;
};

export default OrderDetailsPage;