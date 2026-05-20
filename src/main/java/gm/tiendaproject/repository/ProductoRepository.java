package gm.tiendaproject.repository;

import gm.tiendaproject.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    @Query("SELECT p FROM Producto p WHERE " +
            "(:nombre IS NULL OR :nombre = '' OR LOWER(p.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))) AND " +
            "(:categoria IS NULL OR :categoria = '' OR p.categoria.nombre = :categoria)")
    List<Producto> buscarProductosFiltrados(@Param("nombre") String nombre, @Param("categoria") String categoria);

    List<Producto> findByCategoriaNombre(String nombreCategoria);
}