using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace API.Annotations
{
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, AllowMultiple = false)]
    public class CustomAnnotation : ValidationAttribute
    {
        protected ValidationAttribute[] _attributes;

        public CustomAnnotation()
        {
        }
    

    public override bool IsValid(object value)
        {
            return _attributes.All(a => a.IsValid(value));
        }

        public IEnumerable<ModelClientValidationRule> GetClientValidationRules(System.Web.Mvc.ModelMetadata metadata, System.Web.Mvc.ControllerContext context)
        {
            return _attributes
                .OfType<IClientValidatable>()
                .SelectMany(x => x.GetClientValidationRules(metadata, context));
        }
    }
}