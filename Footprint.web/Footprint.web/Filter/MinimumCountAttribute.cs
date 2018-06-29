using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Footprint.web.Filter
{
    public class MinimumCountAttribute: ValidationAttribute
    {
        private readonly int _minCount;
        private readonly bool _allowEmptyStringValues;
        private readonly bool _required;
        private const string _defaultError = "'{0}'必须大于{1}项.";

        public MinimumCountAttribute() : this(1){}

        public MinimumCountAttribute(int minCount, bool required = true, bool allowEmptyStringValues = false) : base(_defaultError)
        {
            _minCount = minCount;
            _required = required;
            _allowEmptyStringValues = allowEmptyStringValues;
        }

        public override bool IsValid(object value)
        {
            if (value == null)
                return !_required;


            var stringList = value as ICollection<string>;
            if (!_allowEmptyStringValues && stringList != null)
                return stringList.Count(s => !string.IsNullOrWhiteSpace(s)) >= _minCount;


            var list = value as ICollection;
            if (list != null)
                return list.Count >= _minCount;
            return false;
        }

        public override string FormatErrorMessage(string name)
        {
            return String.Format(this.ErrorMessageString, name, _minCount);
        }

    }
}
