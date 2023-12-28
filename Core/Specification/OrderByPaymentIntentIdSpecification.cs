using Core.Entities.OrderAggregate;

namespace Core.Specification
{
    public class OrderByPaymentIntentIdSpecification : BaseSpecification<Order>
    {
        public OrderByPaymentIntentIdSpecification(string paymentIntentId)
            :base(o => o.PaymentIntenId == paymentIntentId)
        {

        }
    }
}
