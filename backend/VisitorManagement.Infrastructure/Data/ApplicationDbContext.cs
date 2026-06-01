using Microsoft.EntityFrameworkCore;
using VisitorManagement.Domain.Entities;

namespace VisitorManagement.Infrastructure.Data;

public sealed class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Department> Departments => Set<Department>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Visitor> Visitors => Set<Visitor>();
    public DbSet<VisitStatus> VisitStatuses => Set<VisitStatus>();
    public DbSet<Visit> Visits => Set<Visit>();
    public DbSet<Approval> Approvals => Set<Approval>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Role>(entity =>
        {
            entity.ToTable("Roles");
            entity.HasKey(e => e.RoleId);

            entity.HasMany(e => e.Users)
                .WithOne(u => u.Role)
                .HasForeignKey(u => u.RoleId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Department>(entity =>
        {
            entity.ToTable("Departments");
            entity.HasKey(e => e.DepartmentId);

            entity.HasMany(e => e.Users)
                .WithOne(u => u.Department)
                .HasForeignKey(u => u.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");
            entity.HasKey(e => e.UserId);

            entity.HasOne(e => e.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(e => e.RoleId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Department)
                .WithMany(d => d.Users)
                .HasForeignKey(e => e.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(e => e.HostedVisits)
                .WithOne(v => v.HostUser)
                .HasForeignKey(v => v.HostUserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(e => e.ApprovedVisits)
                .WithOne(v => v.ApprovedByUser)
                .HasForeignKey(v => v.ApprovedBy)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(e => e.CreatedVisits)
                .WithOne()
                .HasForeignKey(v => v.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Visitor>(entity =>
        {
            entity.ToTable("Visitors");
            entity.HasKey(e => e.VisitorId);

            entity.HasMany(e => e.Visits)
                .WithOne(v => v.Visitor)
                .HasForeignKey(v => v.VisitorId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<VisitStatus>(entity =>
        {
            entity.ToTable("VisitStatus");
            entity.HasKey(e => e.VisitStatusId);

            entity.HasMany(e => e.Visits)
                .WithOne(v => v.VisitStatus)
                .HasForeignKey(v => v.VisitStatusId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Visit>(entity =>
        {
            entity.ToTable("Visits");
            entity.HasKey(e => e.VisitId);

            entity.HasOne(e => e.Visitor)
                .WithMany(v => v.Visits)
                .HasForeignKey(e => e.VisitorId)
                .OnDelete(DeleteBehavior.Cascade);

             entity.HasOne(e => e.Department)
                .WithMany(d => d.Visits)
                .HasForeignKey(e => e.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);


            entity.HasOne(e => e.HostUser)
                .WithMany(u => u.HostedVisits)
                .HasForeignKey(e => e.HostUserId)
                .OnDelete(DeleteBehavior.Restrict);

        
            entity.HasOne(e => e.VisitStatus)
                .WithMany(s => s.Visits)
                .HasForeignKey(e => e.VisitStatusId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.ApprovedByUser)
                .WithMany(u => u.ApprovedVisits)
                .HasForeignKey(e => e.ApprovedBy)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.CreatedByUser)
                .WithMany(u => u.CreatedVisits)
                .HasForeignKey(e => e.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Approval>(entity =>
{
    entity.ToTable("Approvals");

    entity.HasKey(e => e.ApprovalId);

    entity.Property(e => e.Status)
        .HasMaxLength(100)
        .IsRequired();

    entity.Property(e => e.Remarks)
        .HasMaxLength(1000);

    entity.HasOne(e => e.Visit)
        .WithMany(v => v.Approvals)
        .HasForeignKey(e => e.VisitId)
        .OnDelete(DeleteBehavior.Restrict);

    entity.HasOne(e => e.ApproverUser)
        .WithMany(u => u.Approvals)
        .HasForeignKey(e => e.ApproverUserId)
        .OnDelete(DeleteBehavior.Restrict);
});
    }
}