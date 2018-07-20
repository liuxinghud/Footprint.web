using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;

namespace FootPrint.Business
{
    public static class QueryableOrderbyExtensions
    {

        public static IOrderedQueryable<TSource> CustomOrderBy<TSource>(this IQueryable<TSource> source, string sortName)
        {
            //Expression<Func<TSource, TKey>> keySelector
            if (source == null)
            {
                throw new ArgumentNullException("source");
            }

            var items = sortName.Split(" ", StringSplitOptions.RemoveEmptyEntries);
            //var sortkey = GetKeySelector<TSource, string>(items?[0]);

            var info = GetPropertyInfo<TSource>(items?[0]);
            var ty = info.PropertyType;

            if (ty.IsValueType)
            {
                if (ty == typeof(Int16)) return CreateOrder(source, GetKeySelector<TSource, Int16>(items?[0]), items);
                if (ty == typeof(Int32)) return CreateOrder(source, GetKeySelector<TSource, Int32>(items?[0]), items);
                if (ty == typeof(Int64)) return CreateOrder(source, GetKeySelector<TSource, Int64>(items?[0]), items);
                if (ty == typeof(Enum)) return CreateOrder(source, GetKeySelector<TSource, Enum>(items?[0]), items);
                return CreateOrder(source, GetKeySelector<TSource, ValueType>(items?[0]), items);
            }
            else
            {
                return CreateOrder(source, GetKeySelector<TSource, string>(items?[0]), items);
            }
        }




        private static IOrderedQueryable<TSource> CreateOrder<TSource, TKey>(this IQueryable<TSource> source, Expression<Func<TSource, TKey>> keySelector, string[] items)
        {

            if (items.Length > 1 && string.Equals("desc", items[1], StringComparison.InvariantCultureIgnoreCase))
            {
                return (IOrderedQueryable<TSource>)source.Provider.CreateQuery<TSource>(Expression.Call(null, GetMethodInfo(new Func<IQueryable<TSource>, Expression<Func<TSource, TKey>>, IOrderedQueryable<TSource>>(Queryable.OrderByDescending), source, keySelector), new Expression[]
           {
        source.Expression,
        Expression.Quote(keySelector)
           }));
            }
            else
            {
                return (IOrderedQueryable<TSource>)source.Provider.CreateQuery<TSource>(Expression.Call(null, GetMethodInfo(new Func<IQueryable<TSource>, Expression<Func<TSource, TKey>>, IOrderedQueryable<TSource>>(Queryable.OrderBy), source, keySelector), new Expression[]
                    {
        source.Expression,
        Expression.Quote(keySelector)
                    }));
            }

        }




        //private static MethodInfo GetMethodInfo<T1, T2>(Func<T1, T2> f, T1 unused1)
        //{
        //    return f.Method;
        //}


        private static MethodInfo GetMethodInfo<T1, T2, T3>(Func<T1, T2, T3> f, T1 unused1, T2 unused2)
        {
            return f.Method;
        }




        private static Expression<Func<TSource, TKey>> GetKeySelector<TSource, TKey>(string parameter)
        {
            if (string.IsNullOrEmpty(parameter)) return null;
            Dictionary<string, PropertyInfo> properties = typeof(TSource).GetProperties().ToDictionary(pi => pi.Name);
            ParameterExpression parameterExpression = Expression.Parameter(typeof(TSource));
            var keyValue = properties.FirstOrDefault(x => x.Key.Equals(parameter, StringComparison.InvariantCultureIgnoreCase)).Value;
            Expression expression = Expression.MakeMemberAccess(parameterExpression, keyValue);
            //Func<TSource, string> orderFunc = Expression.Lambda<Func<TSource, string>>(expression, parameterExpression).Compile();
            //return orderFunc;
            var ty = keyValue.PropertyType;
            //var exp=  Expression.Convert(expression,typeof(string));
            Expression<Func<TSource, TKey>> keySelector = Expression.Lambda<Func<TSource, TKey>>(expression, parameterExpression);
            return keySelector;


        }


        public static PropertyInfo GetPropertyInfo<TSource>(string parameter)
        {
            if (string.IsNullOrEmpty(parameter)) return null;
            Dictionary<string, PropertyInfo> properties = typeof(TSource).GetProperties().ToDictionary(pi => pi.Name);
            var keyValue = properties.FirstOrDefault(x => x.Key.Equals(parameter, StringComparison.InvariantCultureIgnoreCase)).Value;
            return keyValue;
        }

    }
}
