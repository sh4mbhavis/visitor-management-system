using System.Collections.Generic;

namespace VisitorManagement.Domain.Entities;

public sealed class VisitStatus
{
    public int VisitStatusId { get; set; }
    public string StatusName { get; set; } = null!;

    public ICollection<Visit> Visits { get; set; } = new List<Visit>();
}