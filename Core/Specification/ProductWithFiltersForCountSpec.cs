﻿using Core.Entities;

namespace Core.Specification
{
    public class ProductWithFiltersForCountSpec : BaseSpecification<Product>
    {
        public ProductWithFiltersForCountSpec(ProductSpceParams productParams)
             : base(x => ((string.IsNullOrEmpty(productParams.Search) || x.Name.ToLower().Contains(productParams.Search)) && !productParams.BrandId.HasValue || x.ProductBrandId == productParams.BrandId) && (!productParams.TypeId.HasValue || x.ProductTypeId == productParams.TypeId))
        {

        }
    }
}
