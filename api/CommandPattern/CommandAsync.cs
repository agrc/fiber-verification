﻿using System.Threading.Tasks;

namespace CommandPattern
{
    public abstract class CommandAsync<T> where T: class
    {
        public abstract Task<T> Execute();

        public abstract override string ToString();

        public virtual async Task<T> Run()
        {
            return await Execute();
        }
    }

    public abstract class CommandAsync
    {
        public abstract Task<int> Execute();

        public abstract override string ToString();

        public virtual async Task<int> Run()
        {
            return await Execute();
        }
    }
}