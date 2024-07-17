using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace DatabaseContext
{
    public class VangSjc
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public ulong Id { get; set; }
        public string Type { get; set; }
        public float BuyPrice { get; set; }
        public float SellPrice { get; set; }
        public string City { get; set; }
        public DateTime UpdatedTime { get; set; }
    }
}
